import { NextResponse, type NextRequest } from "next/server";
import {
  updateUserSessionExpiration,
  getUserFromSession,
} from "./features/auth/db/session";

const authPages = ["/signIn", "/signUp"];
const privateRoutes = ["/home", "/server"];
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next();

  await updateUserSessionExpiration();

  return response;
}

async function middlewareAuth(request: NextRequest) {
  const user = await getUserFromSession();

  if (authPages.includes(request.nextUrl.pathname)) {
    if (user != null) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (privateRoutes.includes(request.nextUrl.pathname)) {
    if (user == null) {
      return NextResponse.redirect(new URL("/signIn", request.url));
    }
  }

  if (adminRoutes.includes(request.nextUrl.pathname)) {
    const user = await getUserFromSession();
    if (user == null) {
      return NextResponse.redirect(new URL("/signIn", request.url));
    }

    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  runtime: "nodejs",
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
