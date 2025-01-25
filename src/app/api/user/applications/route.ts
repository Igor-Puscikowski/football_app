import prisma from "@/utils/db";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Weryfikacja użytkownika
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Pobierz drużynę użytkownika
    const userWithTeam = await prisma.user.findUnique({
      where: { id: user.id },
      select: { team: { select: { id: true } } }, // Użyj relacji `team` do pobrania `id`
    });

    if (!userWithTeam || !userWithTeam.team?.id) {
      return NextResponse.json(
        { error: "User does not belong to a team" },
        { status: 404 }
      );
    }

    const teamId = userWithTeam.team.id;

    // Pobierz zgłoszenia drużyny
    const applications = await prisma.application.findMany({
      where: { teamId },
      include: { match: true },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
