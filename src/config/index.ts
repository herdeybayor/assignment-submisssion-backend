export const PORT = process.env.PORT || 4000;
export const BCRYPT_SALT = process.env.BCRYPT_SALT || 10;
export const APP_NAME = "oasm";
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL || "";
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";
export const JWT_SECRET = process.env.JWT_SECRET || "000-12345-000";
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/oasm";
export const ROLE = {
    ADMIN: ["admin"],
    LECTURER: ["lecturer", "admin"],
    STUDENT: ["student", "admin"],
    USER: ["student", "lecturer", "admin"]
};
export const URL = {
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000"
};
export const MAILER = {
    USER: process.env.MAILER_USER || "",
    PORT: process.env.MAILER_PORT || 465,
    SECURE: process.env.MAILER_SECURE || false,
    PASSWORD: process.env.MAILER_PASSWORD || "",
    HOST: process.env.MAILER_HOST || "smtp.gmail.com",
    DOMAIN: process.env.MAILER_DOMAIN || "@oasm.com"
};
