import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Brak ID użytkownika" },
        { status: 400 }
      );
    }

    const team = await prisma.team.findUnique({
      where: { ownerId: userId },
      include: { players: true },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Drużyna nie istnieje" },
        { status: 404 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
