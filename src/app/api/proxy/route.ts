import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type MethodsType = "POST" | "PATCH" | "DELETE";

interface BodyParamsInterface {
  method: MethodsType;
  resource: string;
  headers: object;
  body: any;
  body_id?: any;
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";

    const reqParams = await getReqParams(contentType, req);
    if (reqParams instanceof NextResponse) return reqParams;

    let fetchURL = `${process.env.API_URL}/${reqParams!.resource}`;

    if (["PATCH", "DELETE"].includes(reqParams!.method)) {
      fetchURL += `/${reqParams?.body_id}`;
    }

    const apiRes = await fetch(fetchURL, {
      method: reqParams?.method,
      headers: {
        ...reqParams!.headers,
        Authorization: `Bearer ${token}`,
      },
      body: reqParams?.body,
    });

    const data = await apiRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: apiRes.status });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
  }
}

async function getReqParams(contentType: string, req: Request) {
  if (contentType.includes("application/json")) {
    return makeBodyJSON(req);
  } else if (contentType.includes("multipart/form-data")) {
    return makeBodyFormData(req);
  }
}

async function makeBodyJSON(req: Request): Promise<NextResponse | BodyParamsInterface> {
  const json = await req.json();

  const resource = json.resource;
  const method: MethodsType = json.method || "POST";

  if (!resource) {
    return NextResponse.json({ error: "Missing resource" }, { status: 400 });
  }

  // build clean (exclude `resource` and `method`)
  const { resource: _, method: __, ...cleanPayload } = json;

  return {
    method: method,
    resource: resource,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanPayload),
    body_id: ["PATCH", "DELETE"].includes(method) ? cleanPayload.id : undefined,
  };
}

async function makeBodyFormData(req: Request): Promise<NextResponse | BodyParamsInterface> {
  const form = await req.formData();

  const resource = form.get("resource") as string;
  const method = (form.get("method") as MethodsType) || "POST";

  if (!resource) {
    return NextResponse.json({ error: "Missing resource" }, { status: 400 });
  }

  // build clean (exclude `resource` and `method`)
  const cleanForm = new FormData();

  form.forEach((value, key) => {
    if (key !== "resource" && key !== "method") {
      cleanForm.append(key, value);
    }
  });

  return {
    method: method,
    resource: resource,
    headers: {},
    body: cleanForm,
    body_id: ["PATCH", "DELETE"].includes(method) ? cleanForm.get("id") : undefined,
  };
}
