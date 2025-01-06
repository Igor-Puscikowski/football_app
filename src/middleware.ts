import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Brak tokena – przekierowanie na stronę logowania
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    verifyToken(token); // Weryfikacja tokena
    return NextResponse.next(); // Jeśli token jest poprawny, kontynuuj
  } catch {
    // Jeśli token jest nieprawidłowy lub wygasł – przekierowanie na login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Konfiguracja, aby middleware działało na określonych ścieżkach
export const config = {
  matcher: ["/team/create/:path*"],
};
