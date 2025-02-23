// app/auth/verify-request/page.tsx
"use client";
import { useRouter } from "next/navigation";

export default function VerifyRequest() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-center text-2xl font-bold mb-6">
          Sprawdź swój e-mail
        </h1>
        <p className="text-center">
          Wysłaliśmy link weryfikacyjny na Twój adres e-mail. Kliknij w niego,
          aby zweryfikować konto.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Przejdź do logowania
        </button>
      </div>
    </div>
  );
}
