import { buildQuery } from "../common/helpers/build-query.helper.js";
import {
   BadRequestException,
   ForbiddenException,
   NotFoundException,
   UnAuthorizedException,
} from "../common/helpers/exception.helper.js";
import { validateId } from "../common/helpers/validateId.helper.js";
import prisma from "../common/prisma/connect.prisma.js";
import { Prisma } from "@prisma/client";

const DO_DAI_NOI_DUNG = 500;

export const imageService = {
   /**
    * GET danh sách hình ảnh
    */
   getImageList: async (req) => {
      const { page, pageSize, filters, skip } = buildQuery(req.query);

      const imagesPromise = prisma.hinh_anh.findMany({
         where: filters,
         skip: skip, // skip qua index bao nhiêu phần tử
         take: pageSize, // số phần tử cần lấy
         select: {
            hinh_id: true,
            ten_hinh: true,
            duong_dan: true,
            mo_ta: true,
            nguoi_dung_id: true,
            nguoi_dung: {
               select: {
                  nguoi_dung_id: true,
                  ho_ten: true,
                  email: true, //Có nên liệt kê email ra đây hay ko?
               },
            },
         },
      });

      const totalItemPromise = prisma.hinh_anh.count({ where: filters });

      // Truy vấn xuống db nên phải dùng await
      const [images, totalItem] = await Promise.all([
         imagesPromise,
         totalItemPromise,
      ]); // ! vì image & totalItem chạy độc lập, nên ta cho nó chạy song song, bằng cách bỏ vào Promise.all() này. Ở trên ta bỏ await

      const totalPage = Math.ceil(totalItem / pageSize);

      return {
         page: page,
         pageSize: pageSize,
         totalItem: totalItem, // SL hình ảnh
         totalPage: totalPage, // SL trang
         items: images || [],
      };
   },

   // GET hình ảnh theo id ảnh
   // findOne: async (req) => {
   //    const { id } = req.params; // Lấy id từ params
   //    // console.log("ID RECEIVED:", id);

   //    if (!id) throw new Error("Thiếu id trong tham số");
   //    const image = await prisma.hinh_anh.findUnique({
   //       where: { hinh_id: Number(id) },
   //    });
   //    return image;
   // },

   /**
    * Tìm kiếm hình ảnh theo tên:
    * có chứa từ khóa,
    * không phân biệt hoa thường,
    * có thể nhập từ khóa không dấu tiếng Việt
    */
   timTheoTenHinh: async (req) => {
      const { name } = req.query;

      const keyword = name.trim().toLowerCase();

      if (!keyword) {
         throw new Error("Vui lòng nhập từ khóa tìm kiếm");
      }

      const images = await prisma.hinh_anh.findMany({
         where: {
            ten_hinh: {
               contains: keyword,
            },
         },
         orderBy: {
            hinh_id: "asc", // sắp xếp theo id tăng dần cho đẹp
         },
      });

      const message =
         images.length > 0
            ? `Tìm thấy ${images.length} hình ảnh với từ khóa "${keyword}"`
            : `Không tìm thấy hình ảnh nào với từ khóa "${keyword}"`;

      // Trả về cả data + message
      return {
         message,
         count: images.length,
         data: images,
      };
   },

   /**
    * GET thông tin hình ảnh & người tạo ảnh bằng id hình ảnh
    */
   getImageByHinh_id: async (req) => {
      const { id } = req.params;

      if (!id) throw new Error("Thiếu id trong tham số");

      const image = await prisma.hinh_anh.findUnique({
         where: { hinh_id: Number(id) },
         include: {
            nguoi_dung: {
               select: {
                  nguoi_dung_id: true,
                  ho_ten: true,
                  tuoi: true,
               },
            },
         },
      });

      if (!image) throw new Error(`Không tìm thấy hình ảnh có id: ${id}`);

      return image;
   },

   /**
    * GET thông tin bình luận theo id ảnh
    */
   getCommentByHinh_Id: async (req) => {
      const { hinh_id } = req.params;
      if (!hinh_id) throw new Error("Thiếu id trong tham số");

      const comments = await prisma.binh_luan.findMany({
         where: { hinh_id: Number(hinh_id) },
         include: {
            nguoi_dung: {
               select: {
                  nguoi_dung_id: true,
                  ho_ten: true,
                  tuoi: true,
               },
            },
         },
         orderBy: { ngay_binh_luan: "asc" },
      });

      if (!comments || comments.length === 0)
         throw new Error(`Không tìm thấy bình luận có id ảnh là: ${hinh_id}`);

      return comments;
   },

   /**
    * GET thông tin đã lưu hình này chưa theo id ảnh (dùng để kiểm tra ảnh đã lưu hay chưa ở nút Save)
    */
   checkSaveImage: async (req) => {
      const { hinh_id } = req.params;
      const user = req.user;

      // 1. Thiếu tham số => Lỗi
      if (!hinh_id) throw new BadRequestException("Chưa có tham số hinh_id");

      // 2. Chưa login => Lỗi
      if (!user || !user.nguoi_dung_id) {
         throw new UnAuthorizedException("Vui lòng đăng nhập!");
      }

      // 3. Kiểm tra ảnh có tồn tại không?
      const imageExists = await prisma.hinh_anh.findUnique({
         where: { hinh_id: Number(hinh_id) },
         // select: { hinh_id: true },
      });

      if (!imageExists) {
         throw new Error(`Không tìm thấy hình ảnh với ID: ${hinh_id}`);
      }

      // 4. Kiểm tra đã lưu ảnh hay chưa?
      const checkSaved = await prisma.luu_anh.findUnique({
         where: {
            nguoi_dung_id_hinh_id: {
               nguoi_dung_id: user.nguoi_dung_id,
               hinh_id: Number(hinh_id),
            },
         },
      });

      return {
         hinh_id: Number(hinh_id),
         saved: !!checkSaved, // true: đã lưu; false: chưa lưu
         // Or: da_luu: saved ? true : false
         message: !!checkSaved ? "Đã lưu" : "Chưa lưu",
         // Or: message: checkSaved ? "Đã lưu" : "Chưa lưu"
      };
   },

   /**
    * POST để lưu thông tin bình luận của người dùng với hình ảnh
    */
   saveComment: async (req) => {
      try {
         const { hinh_id, noi_dung } = req.body;
         const user = req.user;
         console.log({ user });

         // 0. Ép kiểu + kiểm tra có phải số nguyên dương hợp lệ không
         const hinhId = validateId(hinh_id);

         // 1. Validate input (người dùng ko đc tự gửi nguoi_dung_id, vì học đã login & đã có token login)
         if (!noi_dung.trim()) {
            throw new BadRequestException("Vui lòng nhập nội dung bình luận.");
         }

         if (noi_dung.trim().length > DO_DAI_NOI_DUNG) {
            throw new BadRequestException(
               `Nội dung bình luận không được quá ${DO_DAI_NOI_DUNG} kí tự`
            );
         }

         // 2. Kiểm tra nguoi_dudng_id có tồn tại
         if (!user || !user.nguoi_dung_id) {
            throw new UnAuthorizedException("Vui lòng đăng nhập để bình luận");
         }

         // 3. Kiểm tra hình có tồn tại, phải có tồn tại thì mới comment đc
         const hinh = await prisma.hinh_anh.findUnique({
            where: { hinh_id: hinhId }, // Chỉ cần biết có tồn tại.
         });

         if (!hinh) {
            throw new NotFoundException(`Không tồn tại hình có id: ${hinhId}`);
         }

         // 4. Xử lý lưu bình luận
         const newComment = await prisma.binh_luan.create({
            data: {
               nguoi_dung_id: user.nguoi_dung_id,
               hinh_id: hinhId,
               noi_dung: noi_dung.trim(),
            },
            include: {
               nguoi_dung: {
                  select: {
                     ho_ten: true,
                     anh_dai_dien: true,
                  },
               },
            },
         });

         // 5. Trả về data cho Front End
         return newComment;
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new BadRequestException(
               `Lỗi dữ liệu đầu vào ${error.message}`
            );
         }
         throw error;
      }
   },

   create: (req) => {
      const { ten_hinh, duong_dan, mo_ta } = req.body;
      // const user = req.user;

      console.log({ ten_hinh, duong_dan, mo_ta });

      return "Tạo ảnh thành công";
   },

   delete: async (req) => {
      const { hinh_id } = req.params;
      const user = req.user; // lấy từ middleware protect

      const hinhId = validateId(hinh_id);

      const hinh = await prisma.hinh_anh.findUnique({
         where: { hinh_id: hinhId },
      });

      if (!hinh) throw new NotFoundException("Không tìm thấy hình");

      // Chỉ có user login mới có quyền xóa hình của họ
      if (hinh.nguoi_dung_id !== user.nguoi_dung_id) {
         throw new ForbiddenException("Bạn không có quyền xóa hình này");
      }

      // Xóa hình
      await prisma.hinh_anh.delete({ where: { hinh_id: hinhId } });

      return {
         message: "Xóa ảnh thành công",
         hinh_id: hinhId,
         deleted_by: {
            nguoi_dung_id: user.nguoi_dung_id,
            ho_ten: user.ho_ten,
         },
      };
   },
};
