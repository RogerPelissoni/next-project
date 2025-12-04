import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const API_URL = process.env.API_URL!;
    const body = await req.json();

    const apiRes = await fetch(`${API_URL}/resources/retrieve-multiple`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      return NextResponse.json(errorData, { status: apiRes.status });
    }

    const data = await apiRes.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in retrieveMultiple API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
