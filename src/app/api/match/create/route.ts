import { verifyToken } from "@/lib/jwt";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Pobranie tokenu z ciasteczek
    const token = req.cookies.get("token")?.value;
    console.log("Token:", token);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Weryfikacja tokenu
    const user = verifyToken(token);
    console.log("Decoded user:", user);

    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Pobranie ID użytkownika
    const userId = user.id;

    // Sprawdzenie, czy użytkownik ma drużynę
    const team = await prisma.team.findUnique({
      where: { ownerId: userId },
    });
    console.log("Team:", team);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Pobranie danych wejściowych
    const { matchTitle, matchLocation, matchDateTime, matchDescription } =
      await req.json();
    console.log("Request body:", {
      matchTitle,
      matchLocation,
      matchDateTime,
      matchDescription,
    });

    // Walidacja danych wejściowych
    if (!matchTitle || !matchLocation || !matchDateTime || !matchDescription) {
      console.error("Invalid input data");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ID drużyny
    const teamId = team.id;
    console.log("Team ID:", teamId);

    // Tworzenie meczu
    const match = await prisma.match.create({
      data: {
        title: matchTitle,
        location: matchLocation,
        dateTime: matchDateTime,
        description: matchDescription,
        teamId,
        userId,
        status: "Dołącz",
      },
    });
    console.log({
      title: matchTitle,
      location: matchLocation,
      dateTime: matchDateTime,
      description: matchDescription,
      teamId,
      userId,
      status: "Dołącz", // Tymczasowo, aby upewnić się, że jest poprawnie ustawione
    });

    // Zwracanie utworzonego meczu
    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
