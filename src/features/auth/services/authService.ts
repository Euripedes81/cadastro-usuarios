import { apiPost } from "../../../services/api/api";

import type { LoginRequest, LoginResponse,} from "../types/auth.types";

const AUTH_ENDPOINT = "/usuarios/logins";

const TOKEN_KEY = "access_token";
const USER_KEY = "authenticated_user";

export const authService = {

  async login(data: LoginRequest): Promise<LoginResponse> {

    const response = await apiPost<LoginRequest, LoginResponse>(
      AUTH_ENDPOINT,
      data
    );

    sessionStorage.setItem(TOKEN_KEY, response.token);

    sessionStorage.setItem(
      USER_KEY,
      JSON.stringify({
        id: response.id,
        nome: response.nome,
        email: response.email,
      })
    );

    return response;
  },

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },

  getUser() {
    const user = sessionStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
  },
};
