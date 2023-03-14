interface UserDataInput {
    name?: string;
    email?: string;
    image?: string;
    password?: string;
    matric?: number;
    level?: string;
    departmentId?: string;
    role?: "student" | "lecturer" | "admin";
}
