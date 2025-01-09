import prisma from "@/utils/db";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user)
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });

    const { teamName, players } = await req.json();

    const existingTeam = await prisma.team.findUnique({
      where: { ownerId: user.id },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: "User already has a team" },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name: teamName,
        ownerId: user.id,
        players: {
          create: players,
        },
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
