interface ApiErrorResponse {
    message?: string;
    errorCode?: string;
    title?: string;
    detail?: string;
    errors?: Record<string, string[] | string>;
}

export class ApiError extends Error {
    public readonly status: number;
    public readonly errorCode?: string;

    constructor(message: string, status: number, errorCode?: string) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.errorCode = errorCode;
    }
}

function extractErrorMessage(data: ApiErrorResponse | null, status: number ): string {

    if (data?.message) {
        return data.message;
    }

    if (data?.errors) {
        const messages = Object.values(data.errors).flatMap(
            (value) => Array.isArray(value) ? value : [value]
        );

        if (messages.length > 0) {
            return messages.join(" ");
        }
    }

    if (data?.detail) {
        return data.detail;
    }

    if (data?.title) {
        return data.title;
    }

    switch (status) {
        case 400:
            return "Dados inválidos.";
        case 401:
            return "Sessão expirada ou acesso não autorizado.";
        case 403:
            return "Você não possui permissão para esta operação.";
        case 500:
            return "Ocorreu um erro interno no servidor.";
        default:
            return `Erro na comunicação com o servidor (${status}).`;
    }
}

async function readResponseBody(response: Response): Promise<unknown> {

    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

export async function handleApiError(response: Response): Promise<ApiError> {

    const data = await readResponseBody(response);

    const errorData = data as ApiErrorResponse | null;

    const message = extractErrorMessage(
        errorData,
        response.status
    );

    return new ApiError(
        message,
        response.status,
        errorData?.errorCode
    );
}