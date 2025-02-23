import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");

    if (!token || !email) {
      const redirectUrl = new URL(
        "/error?message=Invalid verification link.",
        process.env.NEXTAUTH_URL
      );
      return NextResponse.redirect(redirectUrl.toString());
    }

    // Znajdź token w bazie danych
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        identifier: email,
        expires: { gt: new Date() },
      },
    });

    if (!verificationToken) {
      const redirectUrl = new URL(
        "/error?message=Invalid or expired verification token.",
        process.env.NEXTAUTH_URL
      );
      return NextResponse.redirect(redirectUrl.toString());
    }

    // Zaktualizuj użytkownika, oznaczając e-mail jako zweryfikowany
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Usuń zużyty token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    // Przekieruj na stronę logowania z parametrem sukcesu
    const successUrl = new URL(
      "/login?verified=true",
      process.env.NEXTAUTH_URL
    );
    return NextResponse.redirect(successUrl.toString());
  } catch (error) {
    console.error(error);
    const errorUrl = new URL(
      "/auth/error?message=Internal server error.",
      process.env.NEXTAUTH_URL
    );
    return NextResponse.redirect(errorUrl.toString());
  }
}
