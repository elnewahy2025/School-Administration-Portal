import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const clear = searchParams.get("clear");
  const expectedSecret = process.env.UNDER_CONSTRUCTION_BYPASS_SECRET;

  if (clear) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("bypass_construction");
    return response;
  }

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Invalid or unconfigured bypass secret" }, { status: 401 });
  }

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set("bypass_construction", expectedSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
