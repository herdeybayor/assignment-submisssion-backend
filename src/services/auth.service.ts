import ms from "ms";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

import User from "./../models/user.model";
import Department from "./../models/department.model";
import Token from "./../models/token.model";
import MailService from "./mail.service";
import CustomError from "../utils/custom-error";
import { JWT_SECRET, BCRYPT_SALT, URL } from "./../config";
import { Role } from "../types/user";

class AuthService {
    async register(data: RegisterInput) {
        if (!data.name) throw new CustomError("name is required");
        if (!data.email) throw new CustomError("email is required");
        if (!data.password) throw new CustomError("password is required");
        if (!data.registerAs) throw new CustomError("registerAs is required");

        if (data.registerAs === "student") {
            if (!data.matric) throw new CustomError("matric is required");
            if (!data.level) throw new CustomError("level is required");
            if (!data.departmentId) throw new CustomError("department is required");

            const userWithMatric = await User.findOne({ matric: data.matric });
            if (userWithMatric) throw new CustomError("matric already exists");

            const department = await Department.findOne({ _id: data.departmentId });
            if (!department) throw new CustomError("department does not exist");
        }

        let user = await User.findOne({ email: data.email });
        if (user) throw new CustomError("email already exists");

        if (data.registerAs === "student") {
            user = await new User({
                name: data.name,
                email: data.email,
                password: data.password,
                role: Role.student,
                matric: data.matric,
                level: data.level,
                department: data.departmentId
            }).save();
        } else {
            user = await new User({
                name: data.name,
                email: data.email,
                password: data.password,
                role: Role.lecturer
            }).save();
        }

        if (data.registerAs === "student") {
            // Request email verification
            await this.requestEmailVerification(user.email);
        }

        const authTokens = await this.generateAuthTokens({ userId: user.id, role: user.role });

        return { user, token: authTokens };
    }

    async login(data: LoginInput) {
        if (!data.email && !data.matric) throw new CustomError("email or matric is required");
        if (!data.password) throw new CustomError("password is required");

        let user;
        if (data.email) {
            user = await User.findOne({ email: data.email });
        } else {
            user = await User.findOne({ matric: data.matric });
        }

        if (!user) throw new CustomError("incorrect email/matic or password");

        // Check if user password is correct
        const isCorrect = await bcrypt.compare(data.password, user.password);
        if (!isCorrect) throw new CustomError("incorrect email or password");

        const authTokens = await this.generateAuthTokens({ userId: user.id, role: user.role });

        return { user, token: authTokens };
    }

    async generateAuthTokens(data: GenerateTokenInput) {
        const { userId, role } = data;

        const accessToken = JWT.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "1h" });

        const refreshToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(refreshToken, BCRYPT_SALT);

        const refreshTokenJWT = JWT.sign({ userId, refreshToken }, JWT_SECRET, { expiresIn: "30 days" });

        await new Token({
            userId,
            token: hash,
            type: "refresh_token",
            expiresAt: Date.now() + ms("30 days")
        }).save();

        return { accessToken, refreshToken: refreshTokenJWT };
    }

    async refreshAccessToken(data: RefreshTokenInput) {
        const { refreshToken: refreshTokenJWT } = data;

        const decoded: any = JWT.verify(refreshTokenJWT, JWT_SECRET);
        const { userId, refreshToken } = decoded;

        const user = await User.findOne({ _id: userId });
        if (!user) throw new CustomError("User does not exist");

        const RTokens = await Token.find({ userId, type: "refresh_token" });
        if (RTokens.length === 0) throw new CustomError("invalid or expired refresh token");

        let tokenExists = false;

        for (const token of RTokens) {
            const isValid = await bcrypt.compare(refreshToken, token.token);

            if (isValid) {
                tokenExists = true;
                break;
            }
        }

        if (!tokenExists) throw new CustomError("invalid or expired refresh token");

        const accessToken = JWT.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

        return { accessToken };
    }

    async logout(data: LogoutInput) {
        const { refreshToken: refreshTokenJWT } = data;

        const decoded: any = JWT.verify(refreshTokenJWT, JWT_SECRET);
        const { refreshToken, userId } = decoded;

        const user = await User.findOne({ _id: userId });
        if (!user) throw new CustomError("User does not exist");

        const RTokens = await Token.find({ userId, type: "refresh_token" });
        if (RTokens.length === 0) throw new CustomError("invalid or expired refresh token");

        let tokenExists = false;

        for (const token of RTokens) {
            const isValid = await bcrypt.compare(refreshToken, token.token);

            if (isValid) {
                tokenExists = true;
                await token.deleteOne();

                break;
            }
        }

        if (!tokenExists) throw new CustomError("invalid or expired refresh token");

        return true;
    }

    async verifyEmail(data: VerifyEmailInput) {
        const { userId, verifyToken } = data;

        const user = await User.findOne({ _id: userId });
        if (!user) throw new CustomError("User does not exist");
        if (user.isVerified) throw new CustomError("email is already verified");

        const VToken = await Token.findOne({ userId, type: "verify_email" });
        if (!VToken) throw new CustomError("invalid or expired password reset token");

        const isValid = await bcrypt.compare(verifyToken, VToken.token);
        if (!isValid) throw new CustomError("invalid or expired password reset token");

        await User.updateOne({ _id: userId }, { $set: { isVerified: true } }, { new: true });

        await VToken.deleteOne();

        return true;
    }

    async requestEmailVerification(email: string) {
        if (!email) throw new CustomError("email is required");

        const user = await User.findOne({ email });
        if (!user) throw new CustomError("email does not exist");
        if (user.isVerified) throw new CustomError("email is already verified");

        const token = await Token.findOne({ userId: user.id, type: "verify_email" });
        if (token) await token.deleteOne();

        const verifyToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(verifyToken, BCRYPT_SALT);

        await new Token({
            token: hash,
            userId: user.id,
            type: "verify_email",
            expiresAt: Date.now() + ms("1h")
        }).save();

        const link = `${URL.CLIENT_URL}/email-verification?uid=${user.id}&verifyToken=${verifyToken}`;

        // Send Mail
        await new MailService(user).sendEmailVerificationMail(link);

        return true;
    }

    async requestPasswordReset(email: string) {
        if (!email) throw new CustomError("email is required");

        const user = await User.findOne({ email });
        if (!user) throw new CustomError("email does not exist");

        const token = await Token.findOne({ userId: user.id, type: "reset_password" });
        if (token) await token.deleteOne();

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, BCRYPT_SALT);

        await new Token({
            token: hash,
            userId: user.id,
            type: "reset_password",
            expiresAt: Date.now() + ms("1h")
        }).save();

        const link = `${URL.CLIENT_URL}/reset-password?uid=${user.id}&resetToken=${resetToken}`;

        // Send Mail
        await new MailService(user).sendPasswordResetMail(link);

        return true;
    }

    async resetPassword(data: ResetPasswordInput) {
        const { userId, resetToken, password } = data;

        const RToken = await Token.findOne({ userId, type: "reset_password" });
        if (!RToken) throw new CustomError("invalid or expired password reset token");

        const isValid = await bcrypt.compare(resetToken, RToken.token);
        if (!isValid) throw new CustomError("invalid or expired password reset token");

        const hash = await bcrypt.hash(password, BCRYPT_SALT);

        await User.updateOne({ _id: userId }, { $set: { password: hash } }, { new: true });

        await RToken.deleteOne();

        return true;
    }

    async updatePassword(userId: string, data: UpdatePasswordInput) {
        if (!data.oldPassword) throw new CustomError("password is required");
        if (!data.newPassword) throw new CustomError("new password is required");

        const user = await User.findOne({ _id: userId });
        if (!user) throw new CustomError("user dose not exist");

        // Check if user password is correct
        const isCorrect = await bcrypt.compare(data.oldPassword, user.password);
        if (!isCorrect) throw new CustomError("incorrect password");

        // Check if new password is same as old password
        if (data.oldPassword == data.newPassword) throw new CustomError("change password to something different");

        const hash = await bcrypt.hash(data.newPassword, BCRYPT_SALT);

        await User.updateOne({ _id: userId }, { $set: { password: hash } }, { new: true });

        return true;
    }
}

export default new AuthService();
