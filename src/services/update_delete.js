// Giả định các import cần thiết
import prisma from "../common/prisma/connect.prisma.js";
import bcrypt from "bcrypt";
import tokenService from "./token.service.js";
import { BadRequestException, NotFoundException, UnAuthorizedException } from "../common/helpers/exception.helper.js";


export const authService = {
    // ... (Các hàm register, login, getInfo, findAll, findOne) ...
    
    // Đã được chỉnh sửa để tập trung vào bảo mật, hiệu năng (async) và ràng buộc
    update: async (req) => {
        // 1. Lấy và kiểm tra ID từ params
        const id = req.params.id;

        // BẢO MẬT & RÀNG BUỘC MỚI: Kiểm tra ID phải là chuỗi số nguyên dương hợp lệ (Ví dụ: chặn "5a" hoặc "-5")
        if (typeof id !== 'string' || id.length === 0 || /\D/.test(id)) {
            throw new BadRequestException(`User id: "${id}" không hợp lệ. ID phải là một chuỗi số nguyên dương.`);
        }
        
        const parsedId = parseInt(id, 10);
        
        // Kiểm tra sau khi parsed (dành cho các trường hợp edge case)
        if (isNaN(parsedId) || parsedId <= 0) {
             throw new BadRequestException(`User id: "${id}" không hợp lệ.`);
        }

        // Lấy dữ liệu từ body
        const { email, password, fullName } = req.body;
        // Giả sử req.user được gán bởi middleware xác thực
        const authenticatedUserId = req.user.id; 

        // 2. RÀNG BUỘC AUTHORIZATION: Chỉ người dùng đó mới có thể cập nhật
        if (authenticatedUserId !== parsedId) {
            // Thay BadRequestException bằng UnAuthorizedException rõ ràng hơn
            throw new UnAuthorizedException('Bạn không có quyền cập nhật thông tin người dùng khác.');
        }

        const dataToUpdate = {};

        // 3. Logic cập nhật Email (Cần kiểm tra trùng lặp email mới)
        if (email) {
            // Kiểm tra email mới có bị trùng với user khác không
            const existingUserWithEmail = await prisma.users.findUnique({
                where: { email: email }
            });

            // Nếu email tồn tại VÀ không phải là email của chính người dùng đang cập nhật
            if (existingUserWithEmail && existingUserWithEmail.id !== parsedId) {
                throw new BadRequestException(`Email: ${email} đã được sử dụng bởi người dùng khác.`);
            }
            dataToUpdate.email = email;
        }

        // 4. Logic cập nhật Mật khẩu (Chỉ hash và update khi mật khẩu được cung cấp)
        if (password) {
            // Sử dụng bcrypt.hash (async) và salt round 10 (mức khuyến nghị)
            const hashedPassword = await bcrypt.hash(password, 10); 
            dataToUpdate.password = hashedPassword;
        }

        // 5. Cập nhật fullName
        if (fullName) {
            dataToUpdate.fullName = fullName;
        }
        
        // Kiểm tra xem có dữ liệu nào để cập nhật không
        if (Object.keys(dataToUpdate).length === 0) {
            throw new BadRequestException("Không có dữ liệu hợp lệ nào được cung cấp để cập nhật.");
        }

        try {
            // 6. Cập nhật thông tin user vào db bằng ID
            const updatedUser = await prisma.users.update({
                where: { id: parsedId },
                data: dataToUpdate,
                select: { id: true, email: true, fullName: true, createdAt: true } // Không trả về mật khẩu
            });
            return {
                message: `Cập nhật user id: ${parsedId} thành công`,
                user: updatedUser
            };

        } catch (error) {
             // Bắt lỗi NotFoundException nếu id không tồn tại
             if (error.code === 'P2025') {
                throw new NotFoundException(`User id: ${parsedId} không tồn tại (Lỗi này hiếm xảy ra do đã check Auth trước).`);
            }
             throw error; 
        }
    },

    // Đã được chỉnh sửa để tối ưu hóa truy vấn DB và ràng buộc
    delete: async function (req) {
        // 1. Lấy và kiểm tra ID từ params
        const id = req.params.id;
        
        // BẢO MẬT & RÀNG BUỘC MỚI: Kiểm tra ID phải là chuỗi số nguyên dương hợp lệ
        if (typeof id !== 'string' || id.length === 0 || /\D/.test(id)) {
            throw new BadRequestException(`User id: "${id}" không hợp lệ. ID phải là một chuỗi số nguyên dương.`);
        }
        
        const parsedId = parseInt(id, 10);

        if (isNaN(parsedId) || parsedId <= 0) {
            throw new BadRequestException(`User id: ${id} không hợp lệ.`);
        }
        
        const authenticatedUserId = req.user.id; // Lấy ID của người dùng đang đăng nhập

        // 2. RÀNG BUỘC AUTHORIZATION: Chỉ người dùng đó mới có thể xóa
        if (authenticatedUserId !== parsedId) {
            throw new UnAuthorizedException('Bạn không có quyền xóa người dùng khác.');
        }

        try {
            // 3. Xóa user khỏi db (chỉ 1 truy vấn)
            const deletedUser = await prisma.users.delete({
                where: { id: parsedId }
            });
            
            // Nếu xóa thành công
            return `Xóa user ${parsedId} thành công`;
            
        } catch (error) {
            // Bắt lỗi P2025 (Record not found) của Prisma nếu user không tồn tại
            if (error.code === 'P2025') {
                throw new NotFoundException(`User id: ${parsedId} không tồn tại.`);
            }
            // Ném lại các lỗi khác
            throw error;
        }
    },
};
