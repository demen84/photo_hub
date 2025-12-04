import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../common/constant/app.constant.js";

const tokenService = {
    // Tạo accessToken bằng userId (Id của bảng Users trong db)
    createToken: (userId) => {
        // hạn sử dụng của access token
        // cần được giảm xuống đáng kể, để giảm thiểu rủi ro khi người dùng bị lộ token
        const accessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, { expiresIn: "1d" }); // hạn dùng 1 day

        // hạn sử dụng của refresh token, thời gian của refresh token sẽ dài hơn nhiều so với access token
        // khi access token hết hạn, người dùng sẽ dùng refresh token để lấy access token mới
        const refreshToken = jwt.sign({ userId: userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // hạn dùng 7 ngày

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    },

    verifyAccessToken: (accessToken, option) => {
        const decodeAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, option);

        return decodeAccessToken; // !jwt.verify/decodeAccessToken trả về 1 object chứa userId và iat, exp. Vd: { userId: 1, iat: 1696544323, exp: 1699136323 }
    },

    verifyRefreshToken: (refreshToken) => {
        const decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        return decodeRefreshToken;
    }
};

export default tokenService;