import { NextResponse } from "next/server";
import { groq, MODELS } from "@/lib/ai/client";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { TOOL_DEFINITIONS } from "@/lib/ai/tools";
import {
  handleToolCall,
  type AIProductResult,
} from "@/lib/ai/tool-handlers";

export const runtime = "nodejs";
export const maxDuration = 60;

type Message = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  messages: Message[];
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];

    // ✅ Direct use — already in Groq format
    const groqTools = TOOL_DEFINITIONS;

    // Build chat history for Groq
    const groqMessages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
    ];

    let lastError: any = null;

    for (const modelName of MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          console.log(`🎯 Trying: ${modelName} (attempt ${attempt + 1})`);

          const collectedProducts: AIProductResult[] = [];
          let currentMessages = [...groqMessages];
          let finalText = "";

          for (let round = 0; round < 3; round++) {
            const completion = await groq.chat.completions.create({
              model: modelName,
              messages: currentMessages,
              tools: groqTools as any,
              tool_choice: "auto",
              temperature: 0.7,
              max_tokens: 1024,
            });

            const choice = completion.choices[0];
            const assistantMsg = choice.message;

            if (
              !assistantMsg.tool_calls ||
              assistantMsg.tool_calls.length === 0
            ) {
              finalText = assistantMsg.content ?? "";
              break;
            }

            currentMessages.push(assistantMsg);

            for (const toolCall of assistantMsg.tool_calls) {
              const fnName = toolCall.function.name;
              let args: Record<string, any> = {};

              try {
                args = JSON.parse(toolCall.function.arguments || "{}");
              } catch {
                args = {};
              }

              console.log(`🔧 Tool: ${fnName}`, args);

              const { result: toolResult, products } = await handleToolCall(
                fnName,
                args
              );

              if (products && products.length > 0) {
                collectedProducts.push(...products);
              }

              currentMessages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(toolResult),
              });
            }
          }

          console.log(`✅ Success: ${modelName}`);

          return NextResponse.json({
            message: {
              role: "assistant",
              content: finalText,
              products: collectedProducts,
            },
          });
        } catch (error: any) {
          lastError = error;
          const status = error?.status ?? error?.message;

          if (
            status?.toString().includes("404") ||
            error?.message?.includes("not found") ||
            error?.message?.includes("does not exist") ||
            error?.message?.includes("decommissioned")
          ) {
            console.log(`⚠️ ${modelName} not available, next...`);
            break;
          }

          if (
            status?.toString().includes("429") ||
            status?.toString().includes("503") ||
            error?.message?.includes("rate limit") ||
            error?.message?.includes("overloaded")
          ) {
            const waitTime = 1500 * Math.pow(2, attempt);
            console.log(
              `⏳ ${modelName} busy, waiting ${waitTime}ms...`
            );
            await sleep(waitTime);
            continue;
          }

          console.log(`❌ ${modelName} failed:`, error?.message);
          break;
        }
      }
    }

    console.error("All models failed:", lastError);
    return NextResponse.json(
      {
        error:
          "AI service is temporarily busy. Please try again in a few moments.",
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      {
        error:
          error.message ?? "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}