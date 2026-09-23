export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResult {
  success: boolean;
  message?: string;
}
