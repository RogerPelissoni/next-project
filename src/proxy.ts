import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthRoute = pathname.startsWith("/auth/login");

  // Usuário não autenticado → manda para login
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const isDashboardPath = pathname.indexOf("dashboard") !== -1;

  // Usuário logado tentando acessar login ou raiz → manda para dashboard
  if (token && !isDashboardPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|public|api).*)"],
};
