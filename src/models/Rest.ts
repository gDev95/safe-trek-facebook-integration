export interface Token {
    accessToken: string,
    refreshToken?: string
}
export interface SafeTrekToken extends Token {
    accessToken: string,
    refreshToken?: string,
    createdAt?: number,
}