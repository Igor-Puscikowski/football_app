import { verifyToken } from "@/lib/jwt";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = verifyToken(token);
    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Pobieramy użytkownika wraz z drużyną
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: { team: true }, // Pobierzemy dane drużyny
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Zwracamy tylko wymagane dane
    return NextResponse.json(
      {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        teamId: userData.team?.id || null, // Upewniamy się, że team może być null
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
