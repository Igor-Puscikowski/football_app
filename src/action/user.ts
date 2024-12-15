"use server";
import prisma from "@/utils/db"; // Prisma Client
import bcrypt from "bcrypt"; // Do haszowania haseł

export async function registerUser(formData: FormData): Promise<void> {
  const userName = formData.get("username") as string | null;
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  // Walidacja danych
  if (!userName || !email || !password) {
    throw new Error("All fields are required.");
  }

  // Sprawdzenie, czy użytkownik już istnieje
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error("User already exists.");
  }

  // Haszowanie hasła
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tworzenie nowego użytkownika w bazie danych
  await prisma.user.create({
    data: {
      name: userName,
      email: email,
      password: hashedPassword,
    },
  });

  console.log("User registered successfully!");
}
