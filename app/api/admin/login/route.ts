import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await prisma.admin.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Criamos a resposta primeiro
    const response = NextResponse.json({ success: true });

    // E anexamos o cookie a essa resposta específica
    response.cookies.set("auth_token", "admin_session_active", {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
      sameSite: "lax",
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
    console.error("ERRO_NO_LOGIN_ADMIN:", error);
  }
}