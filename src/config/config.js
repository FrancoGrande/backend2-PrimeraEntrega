import dotenv from 'dotenv';

dotenv.config(); // para trabajar con variables de entorno



export const config = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL,
    FIRMA_COOKIE: process.env.FIRMA_COOKIE || "ClaveSecreta",
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || "ClaveSecreta",
    JWT_EXPIRES_TIME_TOKEN: process.env.JWT_EXPIRES_TIME_TOKEN || "24hs",
}