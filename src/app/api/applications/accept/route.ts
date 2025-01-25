import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
export async function PATCH(req: NextRequest) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: "confirmed" },
    });

    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error) {
    console.error("Error accepting application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
