// Check nếu version của express từ v5.1 trở lên thì không dùng try{} catch{} ở controller này, dùng thẳng express ... controller luôn

import { responseSuccess } from "../common/helpers/function.helper.js";
import { authService } from "../services/auth.service.js";

// Hàm xử lý chung:
const handleRequest = async (serviceMethod, req, res, next, message) => {
    const result = await serviceMethod(req);
    const response = responseSuccess(result, message);
    res.status(response.statusCode).json(response);
};

export const authController = {
    register: (req, res, next) => {
        return handleRequest(authService.register, req, res, next, `at Controller: Đăng ký thành công`);
    },

    login: async (req, res, next) => {
        // Cách 2: dùng hàm xử lý chung
        // return handleRequest(authService.login, req, res, next, `at Controller: Đăng nhập thành công`);
        // Cách 1: nếu có await thì phải thêm async trước hàm
        const ketQua = await authService.login(req);
        const phanHoi = responseSuccess(ketQua, `Login successfully`);
        res.status(phanHoi.statusCode).json(phanHoi);
    },

    getInfo: (req, res, next) => {
        return handleRequest(authService.getInfo, req, res, next, `at Controller: Lấy thông tin user thành công`);
    },

    googleCallback: async (req, res, next) => {
        // console.log("CONTROLLER: ", req.user);
        const result = await authService.googleCallback(req);
        res.redirect(result); // Chuyển về trang chủ FE sau khi đăng nhập thành công
    },

    refreshToken: (req, res, next) => {
        return handleRequest(authService.refreshToken, req, res, next, `at Controller: Refresh token thành công`);
    }
};