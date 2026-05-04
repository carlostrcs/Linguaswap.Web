import { apiPost } from "./http";

export type LoginRequest = {
    email: string,
    password: string
}

export type LoginResponse = {
    token: string
}

export type RegisterRequest = {
    email: string,
    password: string
}

export type RegisterResponse = {
    userId: string,
    email: string
}

export async function login(body: LoginRequest){
    return apiPost<LoginResponse, LoginRequest>(`/api/auth/login`, body);
}

export async function register(body: RegisterRequest){
    return apiPost<RegisterResponse,RegisterRequest>(`/api/auth/register`, body);
}