export enum Level {
    "100L" = "100",
    "200L" = "200",
    "300L" = "300",
    "400L" = "400"
}

export enum Role {
    "student" = "student",
    "lecturer" = "lecturer",
    "admin" = "admin"
}

export type UserDataInput = {
    name?: string;
    email?: string;
    image?: string;
    password?: string;
    matric?: number;
    level?: string;
    departmentId?: string;
    role?: Role;
};
