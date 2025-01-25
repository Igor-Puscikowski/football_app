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

    // Pobierz mecze użytkownika
    const matches = await prisma.match.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        dateTime: true,
        applications: {
          select: {
            id: true,
            status: true,
            team: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
