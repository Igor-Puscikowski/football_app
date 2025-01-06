import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/utils/db";

export async function POST(req: NextRequest) {
  try {
    // Pobierz token JWT
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const { name, players } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    // Sprawdź, czy użytkownik już ma drużynę
    const existingTeam = await prisma.team.findFirst({
      where: { ownerId: decoded.userId },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: "User already owns a team" },
        { status: 400 }
      );
    }

    // Utwórz drużynę
    const team = await prisma.team.create({
      data: {
        name,
        ownerId: decoded.userId,
        players: {
          create:
            players
              ?.slice(0, 6)
              .map(
                (player: {
                  name: string;
                  position: string;
                  skillLevel: string;
                }) => ({
                  name: player.name,
                  position: player.position,
                  skillLevel: player.skillLevel,
                })
              ) || [],
        },
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json(
      { message: "Team created successfully", team },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
