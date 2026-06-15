export const API_BASE_URL = "/api";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const crud = <T, C extends object, U extends object>(path: string) => ({
  list: () => request<T[]>(path),
  create: (data: C) =>
    request<T>(path, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: U) =>
    request<T>(`${path}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) => request<T>(`${path}/${id}`, { method: "DELETE" }),
});
