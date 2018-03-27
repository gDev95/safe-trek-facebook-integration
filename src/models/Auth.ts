export interface Token {
    accessToken: string,
}
export interface SafeTrekToken extends Token {
    accessToken: string,
    refreshToken: string,
    createdAt?: Date,
}