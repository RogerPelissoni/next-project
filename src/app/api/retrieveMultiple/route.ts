import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const API_URL = process.env.API_URL!;
    const body = await req.json();

    const apiRes = await fetch(`${API_URL}/retrieve/retrieve-multiple`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
