import response from "../utils/response";
import AuthService from "../services/auth.service";

import type { CookieOptions, Request, Response } from "express";
import { NODE_ENV } from "../config";
import ms from "ms";

const BASE_COOKIE_OPTIONS = {
    path: "/",
    // httpOnly: true,
    secure: NODE_ENV !== "development",
    sameSite: NODE_ENV !== "development" ? "none" : "lax",
    domain: NODE_ENV !== "development" ? "oasm-frontend.vercel.app" : "localhost"
} as CookieOptions;

const ACCESS_TOKEN_MAX_AGE = ms("1h");
const REFRESH_TOKEN_MAX_AGE = ms("30d");

class AuthController {
    async register(req: Request, res: Response) {
        const result = await AuthService.register(req.body);
        res.cookie("access_token", result.token.accessToken, { ...BASE_COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE });
        res.cookie("refresh_token", result.token.refreshToken, { ...BASE_COOKIE_OPTIONS, maxAge: REFRESH_TOKEN_MAX_AGE });
        res.status(201).send(response("new user registered successfully", result));
    }

    async login(req: Request, res: Response) {
        const result = await AuthService.login(req.body);
        res.cookie("access_token", result.token.accessToken, { ...BASE_COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE });
        res.cookie("refresh_token", result.token.refreshToken, { ...BASE_COOKIE_OPTIONS, maxAge: REFRESH_TOKEN_MAX_AGE });
        res.status(200).send(response("user login successful", result));
    }

    async refreshAccessToken(req: Request, res: Response) {
        const result = await AuthService.refreshAccessToken(req.body);
        res.cookie("access_token", result.accessToken, { ...BASE_COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE });
        res.status(200).send(response("access token refreshed successfully", result));
    }

    async logout(req: Request, res: Response) {
        const result = await AuthService.logout(req.body);
        res.clearCookie("access_token", BASE_COOKIE_OPTIONS);
        res.clearCookie("refresh_token", BASE_COOKIE_OPTIONS);
        res.status(200).send(response("user logout successful", result));
    }

    async verifyEmail(req: Request, res: Response) {
        const result = await AuthService.verifyEmail(req.body);
        res.status(200).send(response("email verified successfully", result));
    }

    async requestEmailVerification(req: Request, res: Response) {
        const result = await AuthService.requestEmailVerification(req.query.email as string);
        res.status(200).send(response("email verification link sent", result));
    }

    async requestPasswordReset(req: Request, res: Response) {
        const result = await AuthService.requestPasswordReset(req.query.email as string);
        res.status(200).send(response("password reset link sent", result));
    }

    async resetPassword(req: Request, res: Response) {
        const result = await AuthService.resetPassword(req.body);
        res.status(200).send(response("password updated", result));
    }

    async updatePassword(req: Request, res: Response) {
        const result = await AuthService.updatePassword(req.$user.id, req.body);
        res.status(200).send(response("password updated", result));
    }
}

export default new AuthController();
