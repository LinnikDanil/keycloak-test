export interface LoginBody {
    username: string;
    password: string;
}

export interface KeycloakTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
}
