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

    if (response.status === 401) {
      throw new Error("Sessão expirada ou acesso não autorizado.");
    }

    if (response.status === 403) {
      throw new Error("Você não possui permissão para esta operação.");
    }

    throw new Error(
      `Erro na comunicação com o servidor (${response.status}).`
    );
  }

  return response.json() as Promise<TResponse>;
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