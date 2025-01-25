import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    // Pobierz token z ciasteczek
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Zweryfikuj token użytkownika
    const user = verifyToken(token);
    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Pobierz dane drużyny użytkownika
    const currentTeam = await prisma.team.findUnique({
      where: { ownerId: user.id },
    });

    if (!currentTeam) {
      return NextResponse.json(
        { error: "Użytkownik nie posiada drużyny." },
        { status: 400 }
      );
    }

    // Odczytaj dane zgłoszenia z ciała żądania
    const { matchId } = await req.json();

    if (!matchId) {
      return NextResponse.json(
        { error: "ID meczu jest wymagane." },
        { status: 400 }
      );
    }

    // Sprawdź, czy drużyna już aplikowała do meczu
    const existingApplication = await prisma.application.findFirst({
      where: {
        teamId: currentTeam.id,
        matchId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "Drużyna już zgłosiła się do tego meczu." },
        { status: 400 }
      );
    }

    // Utwórz nowe zgłoszenie
    const application = await prisma.application.create({
      data: {
        teamId: currentTeam.id,
        matchId,
        status: "pending", // Domyślny status zgłoszenia
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Błąd podczas tworzenia zgłoszenia:", error);
    return NextResponse.json(
      { error: "Wewnętrzny błąd serwera." },
      { status: 500 }
    );
  }
}
