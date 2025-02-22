// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { hashPassword } from "@/lib/hash"; // Zakładam, że masz funkcję hashującą hasła
import { z } from "zod";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

// Schemat walidacji danych
const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki"),
  email: z.string().email("Nieprawidłowy adres e-mail"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = signUpSchema.safeParse(body);

    // Sprawdzenie poprawności danych
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, email, password } = parsedBody.data;

    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Użytkownik o tym adresie e-mail już istnieje." },
        { status: 400 }
      );
    }

    // Hashowanie hasła
    const hashedPassword = await hashPassword(password);

    // Tworzenie użytkownika w bazie
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    // Generowanie tokenu weryfikacyjnego
    const verificationToken = uuidv4();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token ważny 24h

    // Zapis tokenu w bazie
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: verificationTokenExpiry,
      },
    });

    // Konfiguracja wysyłki e-maila (np. Gmail)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Link weryfikacyjny
    const verificationLink = `${
      process.env.NEXTAUTH_URL
    }/api/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(
      email
    )}`;
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Zweryfikuj swoje konto w Football App",
      html: `
        <h1>Zweryfikuj swój e-mail</h1>
        <p>Kliknij <a href="${verificationLink}">tutaj</a>, aby zweryfikować swoje konto.</p>
        <p>Ten link wygaśnie za 24 godziny.</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Sprawdź e-mail, aby zweryfikować konto." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
