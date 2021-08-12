export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
