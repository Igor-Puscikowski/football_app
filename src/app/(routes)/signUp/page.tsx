"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// 🛡️ Schemat walidacji Zod
const signUpSchema = z.object({
  username: z.string().min(3, "Username must have at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 📚 Typowanie formularza
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError("root", {
          message: errorData.error || "Something went wrong!",
        });
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("root", { message: "An unexpected error occurred." });
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-center text-2xl font-bold mb-6">Stwórz konto</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Nazwa użytkownika
            </label>
            <input
              {...register("username")}
              id="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Hasło
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          {errors.root && (
            <p className="text-red-500 text-sm mb-4">{errors.root.message}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? "Rejestrowanie..." : "Stwórz konto"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Masz już konto?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Zaloguj się
          </a>
        </p>
      </div>
    </div>
  );
}
