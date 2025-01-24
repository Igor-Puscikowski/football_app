import { verifyToken } from "@/lib/jwt";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const { matchId } = await req.json();

    if (!matchId) {
      return NextResponse.json(
        { error: "Missing matchId in request body" },
        { status: 400 }
      );
    }

    // Sprawdzenie, czy użytkownik zgłosił się już do meczu
    const application = await prisma.application.findFirst({
      where: {
        matchId,
        team: {
          ownerId: user.id,
        },
      },
    });

    return NextResponse.json(
      { hasApplied: Boolean(application) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
