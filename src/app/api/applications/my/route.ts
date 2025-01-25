import prisma from "@/utils/db";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const userWithTeam = await prisma.user.findUnique({
      where: { id: user.id },
      select: { team: { select: { id: true } } },
    });

    if (!userWithTeam || !userWithTeam.team?.id) {
      return NextResponse.json(
        { error: "User does not belong to a team" },
        { status: 404 }
      );
    }

    const applications = await prisma.application.findMany({
      where: { teamId: userWithTeam.team.id },
      include: {
        match: {
          include: {
            team: true, // Dołącz szczegóły drużyny związanej z meczem
          },
        },
      },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching user's applications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
