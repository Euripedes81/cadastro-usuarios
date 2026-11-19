const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error(
        "A variável VITE_API_BASE_URL não foi configurada."
    );
}

export async function apiPost<TRequest, TResponse>(endpoint: string, data: TRequest): Promise<TResponse> {
    
    console.log("apiPost called with endpoint:", endpoint, "and data:", data);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Email ou senha inválidos.");
        }

        throw new Error(
            `Erro na comunicação com o servidor (${response.status}).`
        );
    }

    console.log("apiPost response:", response);

    return response.json() as Promise<TResponse>;
}