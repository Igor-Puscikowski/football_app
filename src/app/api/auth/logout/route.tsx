import { NextResponse } from "next/server";

export async function POST() {
  try {
    return NextResponse.json(
      { message: "Logged out successfully" },
      {
        status: 200,
        headers: {
          "Set-Cookie":
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;",
        },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
