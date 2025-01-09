import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { comparePassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";
import { z } from "zod";

// 🛡️ Schemat walidacji Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    // 📝 Parsowanie i walidacja danych wejściowych
    const body = await req.json();
    const parsedBody = loginSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsedBody.data;

    // 🔍 Znajdowanie użytkownika w bazie
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 🔑 Sprawdzenie hasła
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 🎟️ Generowanie tokenu JWT z odpowiednimi danymi
    const token = signToken({ id: user.id, email: user.email });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
