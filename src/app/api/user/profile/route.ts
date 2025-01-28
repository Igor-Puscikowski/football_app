import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        name: true,
        team: {
          select: {
            name: true,
          },
        },
        matches: {
          where: { dateTime: { gte: new Date() } },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { team, name, matches } = userData;
    return NextResponse.json({
      nickname: name,
      teamName: team?.name || null,
      activeMatches: matches.length,
    });
  } catch (error) {
    console.log("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
