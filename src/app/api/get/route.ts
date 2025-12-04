import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const API_URL = process.env.API_URL!;
  const url = new URL(req.url);
  const resource = url.searchParams.get("resource");

  if (!resource) {
    return NextResponse.json({ error: "Missing resource param" }, { status: 400 });
  }

  const params = new URLSearchParams(url.searchParams);
  params.delete("resource");

  const finalUrl = `${API_URL}/${resource}?${params.toString()}`;

  const res = await fetch(finalUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  return NextResponse.json(data);
}
