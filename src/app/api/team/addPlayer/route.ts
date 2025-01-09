import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST(req: NextRequest) {
  try {
    const { teamId, name, position, skillLevel } = await req.json();

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { players: true },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Drużyna nie istnieje" },
        { status: 404 }
      );
    }

    if (team.players.length >= 6) {
      return NextResponse.json(
        { error: "Maksymalna liczba zawodników to 6" },
        { status: 400 }
      );
    }

    const player = await prisma.player.create({
      data: {
        name,
        position,
        skillLevel,
        teamId,
      },
    });

    return NextResponse.json(player); // Zweryfikuj, że player ma poprawny typ
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
