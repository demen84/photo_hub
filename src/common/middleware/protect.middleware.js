import tokenService from "../../services/token.service.js";
import { UnAuthorizedException } from "../helpers/exception.helper.js";
import prisma from "../prisma/connect.prisma.js";

const TOKEN_TYPE = "Bearer";

const protect = async (req, res, next) => {
    try {
        // Middleware bảo vệ route (chỉ cho phép user đã đăng nhập truy cập)
        // Lấy token từ headers để kiểm tra xem token có hợp lệ không
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw new UnAuthorizedException(`Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.`);
        }

        // Xử lý tách "Bearer <token>" từ authorization header
        const [type, accessToken] = authorization.split(" ");
        if (type !== TOKEN_TYPE) {
            throw new UnAuthorizedException(`Authorization header phải có định dạng: ${TOKEN_TYPE} token.`);
        }
        if (!accessToken) {// Xác minh token có tồn tại/hợp lệ không
            throw new UnAuthorizedException(`Access Token không hợp lệ.`);
        }

        console.log("token", accessToken)

        /**
         * !So sánh/Xác minh accessToken xem có hợp lệ không?
         * !Vì phương thức verifyAccessToken trả về 1 object có chứa userId, nên ta phải khai báo biến kiểu object điể nhận kết quả trả về
         */
        const { userId } = tokenService.verifyAccessToken(accessToken);

        // Kiểm tra userId có tồn tại trong db không
        const userExist = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                avatar: true,
                password: false, // false thì không cần liệt kê trường password ra đây
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!userExist) {
            throw new UnAuthorizedException(`Người dùng không tồn tại.`);
        }

        // console.log({ authorization, type, accessToken, userExist });

        req.user = userExist; // gán thông tin user vào req.user để các controller phía sau protect dùng.

        next();
    } catch (error) {
        next(error); // Gửi lỗi sang middleware xử lý lỗi tập trung 
    }
};

export default protect;