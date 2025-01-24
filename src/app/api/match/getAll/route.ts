import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Pobranie wszystkich meczów z bazy danych, w tym nazwy drużyny
    const matches = await prisma.match.findMany({
      include: {
        team: {
          select: {
            name: true, // Pobranie tylko nazwy drużyny
            id: true,
          },
        },
      },
    });

    // Formatowanie danych do oczekiwanego kształtu
    const formattedMatches = matches.map((match) => ({
      id: match.id,
      title: match.title,
      location: match.location,
      dateTime: match.dateTime,
      description: match.description,
      teamName: match.team.name,
      teamId: match.team.id,
      status: match.status,
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
