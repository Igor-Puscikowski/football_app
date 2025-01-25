import prisma from "@/utils/db";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Weryfikacja tokenu użytkownika
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
    const matches = await prisma.match.findMany({
      where: { userId: user.id },
      include: {
        team: {
          select: {
            name: true,
          },
        },
      },
    });
    const formattedMatches = matches.map((match) => ({
      id: match.id,
      title: match.title,
      location: match.location,
      dateTime: match.dateTime,
      description: match.description,
      status: match.status,
      teamName: match.team?.name || "Nieznana drużyna",
    }));

    return NextResponse.json(formattedMatches, { status: 200 });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
