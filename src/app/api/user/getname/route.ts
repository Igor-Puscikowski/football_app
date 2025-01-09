import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { decodeToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = decodeToken(token); // Dekodowanie tokenu bez weryfikacji
    if (!userData || !userData.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      select: { name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ name: user.name }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/user/get:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
