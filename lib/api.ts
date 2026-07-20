export const API_BASE = "https://genxbaby-backend-production.up.railway.app";


export async function api(
  path: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = "Request failed";

    try {
      const text = await res.text();
      message = text;
    } catch {}

    throw new Error(message);
  }

  try {
    return await res.json();
  } catch {
    return await res.text();
  }
}
