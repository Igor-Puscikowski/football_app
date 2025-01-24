import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } } // Upewnij się, że korzystasz z destructuring `params`
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID not provided" }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id },
      include: { players: true },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error("Error fetching team details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

//cm5popveg0004vytk78646n72
