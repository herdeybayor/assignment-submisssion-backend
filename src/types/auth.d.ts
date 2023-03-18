interface RegisterInput {
    name: string;
    email: string;
    password: string;
    matric?: string;
    level?: string;
    departmentId?: string;
    registerAs: "student" | "lecturer";
}

interface LoginInput {
    matric?: string;
    email?: string;
    password: string;
}

interface GenerateTokenInput {
    userId: string;
    role: string;
}

interface RefreshTokenInput {
    refreshToken: string;
}

interface LogoutInput {
    refreshToken: string;
}

interface VerifyEmailInput {
    userId: string;
    verifyToken: string;
}

interface ResetPasswordInput {
    userId: string;
    resetToken: string;
    password: string;
}

interface UpdatePasswordInput {
    oldPassword: string;
    newPassword: string;
}

interface AuthToken {
    accessToken: string;
    refreshToken: string;
}
