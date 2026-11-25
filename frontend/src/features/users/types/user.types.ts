export interface UserProfile {
  id: number;
  nome: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  inativo: boolean;
  perfil: UserProfile;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export const USER_PROFILE_ADMIN = "Administrador";
export const USER_PROFILE_STANDARD = "Usuário";