export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: "admin" | "staff" | "trainer";
  linked_trainer: number | null;
  linked_member: number | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  username: string;
  password_hash: string;
  role?: string;
  linked_trainer?: number;
  linked_member?: number;
}

export interface UpdateUserRequest {
  username?: string;
  password_hash?: string;
  role?: string;
  linked_trainer?: number;
  linked_member?: number;
  last_login_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
