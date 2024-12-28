import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { hashPassword } from "@/lib/hash";
import { z } from "zod";

// 🛡️ Schemat walidacji Zod
const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    // 📝 Parsowanie i walidacja danych wejściowych
    const body = await req.json();
    const parsedBody = signUpSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, email, password } = parsedBody.data;

    // 🔍 Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 400 }
      );
    }

    // 🔑 Hashowanie hasła
    const hashedPassword = await hashPassword(password);

    // 📝 Tworzenie nowego użytkownika
    await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { success: true, message: "User created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
