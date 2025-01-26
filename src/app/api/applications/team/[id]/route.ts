import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Użyj await na params, jeśli jest wymagane
    const asyncParams = await params;

    // Debugging, aby zobaczyć strukturę params
    console.log("Async Params:", asyncParams);

    // Pobierz aplikację na podstawie applicationId
    const application = await prisma.application.findUnique({
      where: { id: asyncParams.id },
      select: { teamId: true },
    });

    // Sprawdź, czy aplikacja istnieje
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ teamId: application.teamId }, { status: 200 });
  } catch (error) {
    console.error("Error fetching teamId:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
