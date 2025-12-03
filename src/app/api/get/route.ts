import { NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

export async function GET(req: Request) {
  const url = new URL(req.url);

  const resource = url.searchParams.get("resource");
  if (!resource) {
    return NextResponse.json(
      { error: "Missing resource param" },
      { status: 400 }
    );
  }

  // Remove resource da query e mantém os outros filtros (id, search, etc)
  const params = new URLSearchParams(url.searchParams);
  params.delete("resource");

  const finalUrl = `${API_URL}/${resource}?${params.toString()}`;

  console.log("🔗 API PROXY →", finalUrl);

  const res = await fetch(finalUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  return NextResponse.json(data);
}
