"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Opcjonalnie: zainstaluj react-toastify, aby wyświetlać ładne powiadomienia
import "react-toastify/dist/ReactToastify.css"; // Opcjonalnie: style dla react-toastify

// 🛡️ Schemat walidacji Zod
const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy adres e-mail"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

// 📚 Typowanie formularza
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Obsługa parametru verified z URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const verified = url.searchParams.get("verified");

    if (verified === "true") {
      // Wyświetl komunikat o sukcesie (używamy toast, ale możesz użyć alert lub inny komunikat)
      toast.success(
        "E-mail został pomyślnie zweryfikowany. Możesz się teraz zalogować!",
        {
          position: "top-right",
          autoClose: 3000, // Zamknij po 3 sekundach
        }
      );
      // Opcjonalnie: usuń parametr z URL, aby uniknąć ponownego wyświetlania
      window.history.replaceState({}, document.title, "/login");
    }
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError("root", {
          message: errorData.error || "Nieprawidłowe dane logowania.",
        });
        return;
      }

      const { token } = await response.json();
      document.cookie = `token=${token}; path=/;`; // Zapis tokenu w ciasteczku
      router.push("/matches"); // Przekierowanie po zalogowaniu
    } catch (err) {
      setError("root", { message: "Wystąpił nieoczekiwany błąd." });
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-center text-2xl font-bold mb-6">Zaloguj się</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Pole E-mail */}
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
              placeholder="Wpisz swój e-mail"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Pole Hasło */}
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
              placeholder="Wpisz swoje hasło"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Komunikat o błędzie */}
          {errors.root && (
            <p className="text-red-500 text-sm text-center">
              {errors.root.message}
            </p>
          )}

          {/* Przycisk Zaloguj się */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Nie masz konta?{" "}
          <a href="/signUp" className="text-blue-500 hover:underline">
            Zarejestruj się
          </a>
        </p>
      </div>
    </div>
  );
}
