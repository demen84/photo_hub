import prisma from "../prisma/connect.prisma.js";
import {
   ForbiddenException,
   UnAuthorizedException,
} from "../helpers/exception.helper.js";

export const adminProtect = async (req, res, next) => {
   const user = req.user; // từ user từ protect middleware

   // 1. Kiểm tra user đã login chưa?
   if (!user || !user.nguoi_dung_id) {
      throw new UnAuthorizedException("Vui lòng đăng nhập");
   }

   // 2. Lấy thông tin user + vai trò từ DB (đảm bảo mới nhất)
   const userWithRole = await prisma.nguoi_dung.findUnique({
      where: { nguoi_dung_id: user.nguoi_dung_id },
      select: {
         nguoi_dung_id: true,
         vai_tro: {
            select: {
               ten_vai_tro: true, // admin/user
               kich_hoat: true,
            },
         },
      },
   });

   if (!userWithRole) {
      throw new UnAuthorizedException("Người dùng không tồn tại");
   }

   // 3. Kiểm tra vai trò + role có active chưa?
   const roleName = userWithRole.vai_tro?.ten_vai_tro;
   const roleActive = userWithRole.vai_tro?.kich_hoat;

   if (!roleName || roleName !== "admin" || roleActive !== true) {
      throw new ForbiddenException(
         "Bạn không có quyền thực hiện hành động này"
      );
   }

   // Gắn lại user đầy đủ để dùng sau (nếu cần)
   req.user = {
      ...user,
      vai_tro: userWithRole.vai_tro,
   };

   next();
};
