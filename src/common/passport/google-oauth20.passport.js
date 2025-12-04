import { Strategy } from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../constant/app.constant.js";
import passport from "passport";
import prisma from "../prisma/connect.prisma.js";

// Bộ nhớ tạm cho demo
const users = new Map();

export function initStrategyGoogleOauth20() {
    passport.use(
        new Strategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:3069/api/auth/google/callback",
            },
            // Hàm verify của google: kiểm tra & trả về thông tin gmail của user đã có trong google hay chưa?
            async (accessToken, refreshToken, profile, cb) => { //cb: callback
                const email = profile.emails[0].value;
                const userExist = await prisma.users.findUnique({
                    where: { email: profile.emails?.[0]?.value }
                });
                // Nếu user tồn tại => cho đi tiếp
                // Nếu user chưa tồn tại => tạo mới user rồi cho đi tiếp
                if (!userExist) {
                    // Tạo mới user
                    const newUser = await prisma.users.create({
                        data: {
                            email: email, // profile.emails?.[0]?.value
                            fullName: profile.displayName,
                            avatar: profile.photos?.[0]?.value,
                            googleId: profile.id,
                        }
                    });
                    console.dir({ accessToken, refreshToken, profile, cb, newUser }, { colors: true, depth: null });
                    return cb(null, newUser); //thành công
                } else {
                    console.dir({ accessToken, refreshToken, profile, cb, userExist }, { colors: true, depth: null });
                    return cb(null, userExist); //thất bại
                }
            }
        )
    );
}