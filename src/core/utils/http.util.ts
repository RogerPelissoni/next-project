function buildQuery(params?: Record<string, any>) {
  if (!params) return "";
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      qs.append(key, String(value));
    }
  }

  return qs.toString();
}

async function sendGet(resource: string, query?: Record<string, any>) {
  const qs = buildQuery(query);
  const url = `/api/get?resource=${resource}${qs ? `&${qs}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || `Erro ${res.status}`);

  return data;
}

function hasFile(value: any): boolean {
  if (!value) return false;
  if (value instanceof File || value instanceof Blob) return true;

  if (Array.isArray(value)) return value.some((v) => hasFile(v));

  if (typeof value === "object") {
    return Object.values(value).some((v) => hasFile(v));
  }

  return false;
}

async function sendWithBody(method: string, resource: string, data?: Record<string, any>) {
  const containsFile = hasFile(data);

  let body: any;
  const headers: any = {};

  if (containsFile) {
    body = new FormData();
    body.append("resource", resource);
    body.append("method", method);

    if (data) {
      for (const [key, value] of Object.entries(data)) {
        body.append(key, value as any);
      }
    }
  } else {
    body = JSON.stringify({
      resource,
      method,
      ...data,
    });

    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`/api/${method.toLowerCase()}`, {
    method: "POST",
    credentials: "include",
    headers,
    body,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(json.message || `Erro ${res.status}`);

  return json;
}

export const http = {
  get: (resource: string, query?: any) => sendGet(resource, query),
  post: (resource: string, data?: any) => sendWithBody("POST", resource, data),
  put: (resource: string, data?: any) => sendWithBody("PUT", resource, data),
  delete: (resource: string, data?: any) => sendWithBody("DELETE", resource, data),
};
