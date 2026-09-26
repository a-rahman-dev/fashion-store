import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ══════════════════════════════════════════════════════════
// Server Client — for Server Components & API routes
// ══════════════════════════════════════════════════════════
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — can be ignored
            // Middleware handles session refresh
          }
        },
      },
    }
  );
}

// ══════════════════════════════════════════════════════════
// Get current user (server-side)
// ══════════════════════════════════════════════════════════
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ══════════════════════════════════════════════════════════
// Get current user's profile
// ══════════════════════════════════════════════════════════
export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}