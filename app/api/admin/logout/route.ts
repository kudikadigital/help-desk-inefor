import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // 1. Aceder aos cookies
  const cookieStore = await cookies();
  
  // 2. Remover o cookie de autenticação (ajusta o nome 'auth_token' conforme o que definires no login)
  cookieStore.delete("auth_token");

  return NextResponse.json({ success: true });
}