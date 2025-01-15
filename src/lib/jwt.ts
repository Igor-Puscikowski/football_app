import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secret-key";

// Definicja typu payload JWT
interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    throw new Error("Invalid or expired token");
  }
}

export function decodeToken(token: string): TokenPayload | null {
  const decoded = jwt.decode(token) as TokenPayload | null;
  return decoded;
}
