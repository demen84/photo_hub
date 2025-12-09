import "dotenv/config";

// console.log("PROCESS:", process);
/**
 * Cách 1: export từng biến môi trường
 * !Khi import: import { DATABASE_URL, ACCESS_TOKEN_SECRET, ...} from './src/common/constant/app.constant.js';
 * !Khi dùng: const dbURL = DATABASE_URL, ats = ACCESS_TOKEN_SECRET, ...
 */
export const DATABASE_URL = process.env.DATABASE_URL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = Number(process.env.PORT) || 3434;
// export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

console.log(
   "\n=== ENVIRONMENT VARIABLES ===",
   {
      NODE_ENV,
      PORT,
      // DATABASE_URL, // ← không nên log cái này (có password)
      ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET ? "Loaded" : "Missing!",
      REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET ? "Loaded" : "Missing!",
   },
   "\n"
); //Chỉ dành cho dev check (if any), lên Production thì disabled


/**
 * Cách 2: export tất cả biến môi trường trong 1 object
 * !Khi import: import env from './src/common/constant/app.constant.js';
 * !Khi dùng: const dbURL = env.DATABASE_URL, ats = env.ACCESS_TOKEN_SECRET, ...
 */
// const env = {
//     DATABASE_URL: process.env.DATABASE_URL,
//     ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
//     GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
//     GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
// }

// export default env;
