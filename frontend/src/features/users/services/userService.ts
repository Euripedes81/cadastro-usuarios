import { apiGet } from "../../../services/api/api";

import type { ApiResponse, User } from "../types/user.types";

const USERS_ENDPOINT = "/usuarios";

export const userService = {

  async getAll(): Promise<User[]> {

    const response = await apiGet<ApiResponse<User[]>>(USERS_ENDPOINT);

    return response.data;
  },

  async getById(id: number): Promise<User> {

    const response = await apiGet<ApiResponse<User>>(`${USERS_ENDPOINT}/${id}`);

    return response.data;
  }

};