import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams.toString();

  const apiRes = await fetch(`http://127.0.0.1:8000/user?${searchParams}`, {
    // headers: {
      // Authorization: `Bearer ${process.env.API_TOKEN}`,
    // },
  });

  const data = await apiRes.json();

  return NextResponse.json(data);
}
