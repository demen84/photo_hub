import {
   BadRequestException,
   UnAuthorizedException,
} from "../common/helpers/exception.helper.js";
import prisma from "../common/prisma/connect.prisma.js";
import path from "path";
import fs from "fs";
import cloudinary from "../common/cloudinary/init.cloudinary.js";
import { buildQuery } from "../common/helpers/build-query.helper.js";
import { validateId } from "../common/helpers/validateId.helper.js";

export const userService = {
   avatarLocal1: async function (req) {
      // console.log(req.file);
      if (!req.file) {
         throw new BadRequestException(`Chưa có hình avatar`);
      }

      // Lưu tên hình avatar vào field avatar trong bảng users
      await prisma.users.update({
         where: { id: req.user.id }, // !Ta có thể dùng req.user vì tại middleware protect ta đã gán thông tin user vào req.user (req.user = userExist).
         data: { avatar: req.file.filename }, // cập nhật file hình vào field avatar trong bảng users
      });

      //Đảm bảo 1 user chỉ có 1 avatar => xóa hình cũ
      if (req.user.avatar) {
         // Xử lý xóa Local
         const oldPath = path.join("public/images/", req.user.avatar);
         if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
         }

         // Xử lý xóa luôn Cloud để đảm bảo 1 user chỉ có 1 hình avatar
         cloudinary.uploader.destroy(req.user.avatar);
      }

      return "Lưu hình avatar lên local disk public/images thành công!"; // true;
   },

   avatarLocal: async (req) => {
      if (!req.file) {
         throw new BadRequestException(`Chưa có hình avatar`);
      }

      const newFilename = req.file.filename;
      const oldFilename = req.user.avatar; // Lấy tên file cũ trước khi update

      try {
         // 1. CẬP NHẬT DB VỚI TÊN FILE MỚI
         await prisma.users.update({
            where: { id: req.user.id },
            data: { avatar: newFilename },
         });

         // 2. NẾU CẬP NHẬT DB THÀNH CÔNG, TIẾN HÀNH XÓA FILE CŨ
         if (oldFilename) {
            const oldPath = path.join("public/images/", oldFilename);
            if (fs.existsSync(oldPath)) {
               // Dùng try...catch cho thao tác file để không làm crash server
               try {
                  fs.unlinkSync(oldPath);
               } catch (fileError) {
                  console.error(`Lỗi khi xóa file cũ: ${oldPath}`, fileError);
                  // Log lỗi, nhưng vẫn trả về thành công vì DB đã update
               }
            }
         }

         return "Lưu hình avatar lên local disk public/images thành công!";
      } catch (dbError) {
         // 3. NẾU CẬP NHẬT DB THẤT BẠI: PHẢI XÓA FILE MỚI ĐÃ UPLOAD (tránh file thừa)
         const newPath = path.join("public/images/", newFilename);
         if (fs.existsSync(newPath)) {
            try {
               fs.unlinkSync(newPath); // Xóa file mới vì DB không ghi nhận nó
            } catch (cleanupError) {
               console.error(
                  `Lỗi khi dọn dẹp file mới: ${newPath}`,
                  cleanupError
               );
               // Tiếp tục ném ra lỗi DB
            }
         }
         // re-throw lỗi DB ban đầu để controller xử lý
         throw dbError;
      }
   },

   avatarCloud: async function (req) {
      const byteArrayBuffer = req.file.buffer;
      const uploadResult = await new Promise((resolve, reject) => {
         cloudinary.uploader
            .upload_stream((error, uploadResult) => {
               if (error) {
                  return reject(error);
               }
               return resolve(uploadResult);
            })
            .end(byteArrayBuffer);
      });

      await prisma.users.update({
         where: { id: req.user.id },
         data: { avatar: uploadResult.public_id },
      });

      //Đảm bảo 1 user chỉ có 1 avatar => xóa hình cũ
      if (req.user.avatar) {
         // Xử lý xóa luôn Local để đảm bảo 1 user chỉ có 1 hình avatar
         const oldPath = path.join("public/images/", req.user.avatar);
         if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
         }

         // Xử lý xóa Cloud
         cloudinary.uploader.destroy(req.user.avatar);
      }

      // console.log(uploadResult);

      return `Tải hình avatar lên cloudinary thành công!`;
   },

   create: async function (req) {
      return `This action create`;
   },

   // Lấy thông tin user
   findAll: async (req) => {
      // Thêm table Roles để kiểm tra chỉ có user có vai_tro = 'admin' thì mới được lấy danh sách user, role khác thì không đc quyền lấy
      // Tạo têm bảng Roles (vai_tro)

      // user đã được kiểm tra bởi adminProtect middleware

      const { page, pageSize, filters, skip } = buildQuery(req.query);

      const usersPromise = prisma.nguoi_dung.findMany({
         where: filters,
         skip: skip, // skip qua index bao nhiêu phần tử
         take: pageSize, // số phần tử cần lấy
         orderBy: { nguoi_dung_id: "desc" },
         select: {
            nguoi_dung_id: true,
            email: true,
            ho_ten: true,
            tuoi: true,
            anh_dai_dien: true,
            vai_tro_id: true,
            vai_tro: {
               select: { ten_vai_tro: true, dien_giai: true },
            },
         },
      });

      const totalItemPromise = prisma.nguoi_dung.count({
         where: filters,
      });

      // Truy vấn xuống db nên phải dùng await
      const [users, totalItem] = await Promise.all([
         usersPromise,
         totalItemPromise,
      ]); // vì users & totalItem chạy độc lập, nên ta cho nó chạy song song, bằng cách bỏ vào Promise.all() này. Ở trên ta bỏ await

      const totalPage = Math.ceil(totalItem / pageSize);

      return {
         message: "Lấy danh sách người dùng thành công",
         pagination: { page, pageSize, totalItem, totalPage },
         items: users || [],
      };
   },

   findOne: async (req) => {
      const { id } = req.params;
      if (!id) throw new Error("Missing id in request params");
      const user = await prisma.users.findUnique({
         where: { id: Number(id) },
         include: {
            roles: true,
         },
      });
      return user;
   },

   /**
    * Sửa thông tin người dùng
    */
   update: async (req) => {
      // Lấy id (nguoi_dung_id) từ params ở postman
      const { id } = req.params;
      // Lấy thông tin từ body: các thông tin được cập nhật
      // const { ho_ten, tuoi, anh_dai_dien } = req.body;
      const ho_ten = req.body?.ho_ten;
      const tuoi = req.body?.tuoi;
      const anh_dai_dien = req.body?.anh_dai_dien;
      // Lấy user từ protect middleware
      const user = req.user;

      // Validate input
      const userId = validateId(id);

      // Validate quyền của user:
      if (!user || user.nguoi_dung_id !== userId) {
         throw new UnAuthorizedException(
            "Bạn không có quyền sửa thông tin người dùng"
         );
      }

      // Khai báo 1 object rỗng để hứng các thông tin mà user sẽ update
      const updateData = {};

      // Validate ho_ten
      if (ho_ten !== undefined) {
         const hoTen = ho_ten.trim();
         if (hoTen === "") throw new BadRequestException("Họ tên không được để trống.");
         // Add ho_ten vào object
         updateData.ho_ten = hoTen;
      }

      // Validate tuoi
      const minAge = 16, maxAge = 90;
      if (tuoi !== undefined) {
         const age = Number(tuoi);
         if (!Number.isInteger(age) || age < minAge || age > maxAge) {
            throw new BadRequestException(`Tuổi phải là số nguyên từ ${minAge} đến ${maxAge}`);
         }
         // Add tuoi vào object
         updateData.tuoi = age;
      }

      // Validate anh_dai_dien
      if (anh_dai_dien !== undefined) {
         const anhDaiDien = anh_dai_dien.trim();
         if (anhDaiDien === "") throw new BadRequestException("Link ảnh đại diện không được để trống");
         // Add anh_dai_dien vào object
         updateData.anh_dai_dien = anhDaiDien;
      }

      if (Object.keys(updateData).length === 0) {
         throw new BadRequestException("Hãy cung cấp ít nhất một thông tin để cập nhật");
      }


      // Xử lý update thông tin người dùng
      const updateUser = await prisma.nguoi_dung.update({
         where: { nguoi_dung_id: userId },
         data: updateData,
         select: {
            nguoi_dung_id: true,
            ho_ten: true,
            email: true,
            tuoi: true,
            anh_dai_dien: true,
         },
      });

      // Trả về thông tin đã updated cho FE
      return {
         message: "Cập nhật thông tin người dùng thành công.",
         data: updateUser,
      };
   },
};
