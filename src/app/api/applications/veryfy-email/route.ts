// app/api/auth/verify-email/route.ts
import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");

    if (!token || !email) {
      return NextResponse.json(
        { error: "Invalid verification link." },
        { status: 400 }
      );
    }

    // Znajdź token w bazie
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        identifier: email,
        expires: { gt: new Date() }, // Sprawdź, czy token nie wygasł
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired verification token." },
        { status: 400 }
      );
    }

    // Zaktualizuj użytkownika, ustawiając emailVerified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Usuń zużyty token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully. You can now log in.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
