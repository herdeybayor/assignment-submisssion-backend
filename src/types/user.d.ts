interface UserDataInput {
    name?: string;
    email?: string;
    image?: string;
    password?: string;
    role?: "student" | "lecturer" | "admin";
}
