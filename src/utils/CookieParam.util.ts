export class CookieParamUtil {
    static accessToken: string = "accessToken";
    static refreshToken: string = "refreshToken";
    static accessTokenPath: string = "/";
    static refreshTokenPath: string = "/api/auth/refresh";
    static accessTokenMaxAge: number = 15 * 60 * 1000;
    static refreshTokenMaxAge: number = 7 * 24 * 60 * 60 * 1000;
}