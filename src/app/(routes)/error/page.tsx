// app/auth/error/page.tsx
"use client";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  const message = new URLSearchParams(window.location.search).get("message");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-center text-2xl font-bold mb-6">Wystąpił błąd</h1>
        <p className="text-center">{message || "Coś poszło nie tak."}</p>
        <button
          onClick={() => router.push("/signUp")}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Powrót do rejestracji
        </button>
      </div>
    </div>
  );
}
