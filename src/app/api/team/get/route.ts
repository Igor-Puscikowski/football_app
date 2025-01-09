import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    // Pobranie tokenu z ciasteczek
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.error("Token is missing.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Weryfikacja tokenu
    const userData = verifyToken(token);

    if (!userData) {
      console.error("Invalid token.");
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Pobranie drużyny zalogowanego użytkownika
    const team = await prisma.team.findUnique({
      where: { ownerId: userData.id },
      include: { players: true },
    });

    if (!team) {
      console.error("Team not found.");
      return NextResponse.json({ error: "No team found." }, { status: 404 });
    }

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error("Error in /api/team/get:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
