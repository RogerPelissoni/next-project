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
    const contentType = req.headers.get("content-type") || "";

    let resource = "";
    let method = "POST";

    // ============================================================
    // 1. JSON Body
    // ============================================================
    if (contentType.includes("application/json")) {
      const json = await req.json();

      resource = json.resource;
      method = json.method || "POST";

      if (!resource) {
        return NextResponse.json({ error: "Missing resource" }, { status: 400 });
      }

      // remove fields that NestJS must NOT receive
      const { resource: _, method: __, ...cleanPayload } = json;

      const apiUrl = `${API_URL}/${resource}`;

      const apiRes = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanPayload),
      });

      const data = await apiRes.json().catch(() => ({}));
      return NextResponse.json(data, { status: apiRes.status });
    }

    // ============================================================
    // 2. FormData (upload)
    // ============================================================
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();

      resource = form.get("resource") as string;
      method = (form.get("method") as string) || "POST";

      if (!resource) {
        return NextResponse.json({ error: "Missing resource" }, { status: 400 });
      }

      // build clean FormData (exclude `resource` and `method`)
      const cleanForm = new FormData();

      form.forEach((value, key) => {
        if (key !== "resource" && key !== "method") {
          cleanForm.append(key, value);
        }
      });

      const apiUrl = `${API_URL}/${resource}`;

      const apiRes = await fetch(apiUrl, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: cleanForm,
      });

      const data = await apiRes.json().catch(() => ({}));
      return NextResponse.json(data, { status: apiRes.status });
    }

    return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
  } catch (err: any) {
    console.error("[POST ROUTE ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
  }
}
