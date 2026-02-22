import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { getSupabase } from "@/lib/supabase";

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const hash = sha256(password);

    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, role, employee_id, display_name")
      .eq("username", username.toLowerCase().trim())
      .eq("password_hash", hash)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        employeeId: user.employee_id,
        displayName: user.display_name,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
