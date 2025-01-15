import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { id, name, position, skillLevel } = await req.json();

    if (!id || !name || !position || !skillLevel) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedPlayer = await prisma.player.update({
      where: { id },
      data: { name, position, skillLevel },
    });

    return NextResponse.json(updatedPlayer, { status: 200 });
  } catch (error) {
    console.error("Error updating player:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
