import prisma from "@/utils/db";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Pobierz ID meczu z params
    const matchId = await params.id;

    // Weryfikacja tokenu użytkownika
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Pobierz dane do edycji z body
    const body = await req.json();
    const { title, location, dateTime, description } = body;

    // Sprawdź, czy mecz istnieje i należy do użytkownika
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.userId !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to edit this match" },
        { status: 403 }
      );
    }

    // Zaktualizuj dane meczu
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        title,
        location,
        dateTime: new Date(dateTime),
        description,
      },
    });

    return NextResponse.json(updatedMatch, { status: 200 });
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Pobierz ID meczu z params
    const matchId = await params.id;

    // Weryfikacja tokenu użytkownika
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Sprawdź, czy mecz istnieje i należy do użytkownika
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.userId !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to delete this match" },
        { status: 403 }
      );
    }

    // Usuń wszystkie powiązane zgłoszenia do meczu
    await prisma.application.deleteMany({
      where: { matchId },
    });

    // Usuń mecz
    await prisma.match.delete({
      where: { id: matchId },
    });

    return NextResponse.json(
      { message: "Match and related applications deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting match and applications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const match = await prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(match, { status: 200 });
  } catch (error) {
    console.error("Error fetching match:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
