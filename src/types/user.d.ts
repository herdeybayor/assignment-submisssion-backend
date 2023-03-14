interface UserDataInput {
    name?: string;
    email?: string;
    image?: string;
    password?: string;
    level?: string;
    departmentId?: string;
    role?: "student" | "lecturer" | "admin";
}
