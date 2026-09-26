import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

// ══════════════════════════════════════════════════════════
// OAuth & Magic Link Callback Handler
// ══════════════════════════════════════════════════════════
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}