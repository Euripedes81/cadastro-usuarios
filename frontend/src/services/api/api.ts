import { handleApiError } from "./apiError";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "A variável VITE_API_BASE_URL não foi configurada."
  );
}

async function request<TResponse>(endpoint: string, options: RequestInit = {}, authenticated = false): Promise<TResponse> {

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (authenticated) {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      throw new Error("Token de autenticação não encontrado.");
    }

    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw await handleApiError(response);
  }

  const data = await response.json();

  return data as TResponse;
}

export function apiPost<TRequest, TResponse>(endpoint: string, data: TRequest): Promise<TResponse> {

  return request<TResponse>(
    endpoint,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function apiGet<TResponse>(endpoint: string): Promise<TResponse> {

  return request<TResponse>(
    endpoint,
    {
      method: "GET",
    },
    true
  );
}

export function apiPut<T>(endpoint: string, body: unknown): Promise<T> {

  return request<T>(
    endpoint,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
    true
  );
}