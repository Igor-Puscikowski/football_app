import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/lib/jwt";

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const { teamName } = await req.json();
    const team = await prisma.team.findUnique({
      where: {
        ownerId: user.id,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    await prisma.team.update({
      where: { id: team.id },
      data: { name: teamName },
    });

    return NextResponse.json({ message: "Team name updated successfully" });
  } catch (error) {
    console.error("Error updating team name:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
