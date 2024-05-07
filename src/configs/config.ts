import dotenv from "dotenv";

dotenv.config();

export const config = {
  HOST: process.env.HOST,
  PORT: Number(process.env.PORT),
  MONGO_URL: process.env.MONGO_URL,

  HASH_ROUNDS: Number(process.env.HASH_ROUNDS),

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
};
