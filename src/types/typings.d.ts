interface JWTPayload {
    id: string;
    iat: number;
    exp: number;
    role: "student" | "lecturer" | "admin";
}
interface PaginationInput {
    limit?: number;
    next?: string;
}
