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
const DO_DAI_MO_TA = 500;
const DO_DAI_TEN_HINH = 255;
const DO_DAI_DUONG_DAN = 500;

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

      if (!name || typeof name !== "string" || !name.trim()) {
         throw new BadRequestException("Vui lòng nhập từ khóa tìm kiếm");
      }

      const keyword = name.trim().toLowerCase();

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
      const { hinh_id } = req.params;

      const hinhId = validateId(hinh_id);

      if (!hinhId) throw new Error("Thiếu hinh_id trong tham số");

      const image = await prisma.hinh_anh.findUnique({
         where: { hinh_id: hinhId },
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

      if (!image) throw new Error(`Không tìm thấy hình ảnh có id: ${hinhId}`);

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

   /**
    * POST thêm 1 ảnh của user
    * Chỉ có user login mới có quyền thêm ảnh của họ
    */
   create: async (req) => {
      try {
         const { ten_hinh, duong_dan, mo_ta } = req.body;
         const user = req.user;

         // console.log({ ten_hinh, duong_dan, mo_ta });

         // 0. Kiểm tra user đăng nhập?
         if (!user || !user.nguoi_dung_id) {
            throw new UnAuthorizedException("Vui lòng đăng nhập để thêm ảnh");
         }

         // 1. Validate input
         if (!ten_hinh || typeof ten_hinh !== "string" || !ten_hinh.trim()) {
            throw new BadRequestException(
               "Tên hình là bắt buộc & không được để trống."
            );
         }

         if (!duong_dan || typeof duong_dan !== "string" || !duong_dan.trim()) {
            throw new BadRequestException(
               "Đường dẫn hình ảnh là bắt buộc & không được để trống."
            );
         }

         // Kiểm tra URL hợp lệ (tùy chọn)
         // try {
         //    new URL(duong_dan);
         // } catch {
         //    throw new BadRequestException("Đường dẫn ảnh không phải là URL hợp lệ");
         // }

         // kiểm tra mô tả, vì mo_ta là optional (có hay ko cũng đc)
         const moTa =
            mo_ta && typeof mo_ta === "string" ? mo_ta.trim() || null : null; // chỉ khi có data thì mới trim()

         // Giới hạn độ dài
         if (ten_hinh.trim().length > DO_DAI_TEN_HINH) {
            throw new BadRequestException(
               `Tên hình không được quá ${DO_DAI_TEN_HINH} ký tự`
            );
         }
         if (duong_dan.trim().length > DO_DAI_DUONG_DAN) {
            throw new BadRequestException(
               `Đường dẫn không được quá ${DO_DAI_DUONG_DAN} ký tự`
            );
         }
         if (moTa && moTa.length > DO_DAI_MO_TA) {
            throw new BadRequestException(
               `Mô tả không được quá ${DO_DAI_MO_TA} ký tự`
            );
         }

         // 3. Xử lý lưu ảnh
         const newImage = await prisma.hinh_anh.create({
            data: {
               ten_hinh: ten_hinh.trim(),
               duong_dan: duong_dan.trim(),
               mo_ta: moTa,
               nguoi_dung_id: user.nguoi_dung_id, // ! Lưu ảnh đúng với user login, không có dòng này thì prisma sẽ báo lỗi.
            },
            include: {
               // Show thông tin này để biết người dùng nào thêm ảnh, tạo sự thân thiện & đầy đủ thông tin, tiện lợi cho Front End
               nguoi_dung: {
                  select: {
                     nguoi_dung_id: true,
                     ho_ten: true,
                     tuoi: true,
                     anh_dai_dien: true,
                  },
               },
            },
         });

         // 4. Trả về response
         return {
            message: "Thêm ảnh thành công",
            data: newImage,
         };
      } catch (error) {
         // Lớp bảo vệ cuối: không để server bị CRASH
         // Prisma lỗi (trùng, ràng buộc, v.v...)
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
               throw new BadRequestException("Đường dẫn ảnh đã tồn tại");
            }
            if (error.code === "P2003") {
               throw new BadRequestException("Người dùng không tồn tại");
            }
         }

         // Nếu lỗi đã là custom exception → ném tiếp
         if (
            error instanceof BadRequestException ||
            error instanceof UnAuthorizedException ||
            error instanceof NotFoundException ||
            error instanceof ForbiddenException
         ) {
            throw error;
         }

         // Lỗi không lường trước → log + ẩn chi tiết (bảo mật)
         console.error("Lỗi không xác định khi lưu ảnh:", error);
         throw new BadRequestException(
            "Có lỗi xảy ra khi thêm ảnh. Vui lòng thử lại sau."
         );
      }
   },

   /**
    * Xử lý theo kiểu nâng cao Add transaction handling
    */
   create2: async (req) => {
      const { ten_hinh, duong_dan, mo_ta } = req.body;
      const user = req.user;

      // === BẮT ĐẦU GIAO DỊCH – TẤT CẢ HOẶC KHÔNG LÀ GÌ CẢ ===
      return await prisma.$transaction(async (tx) => {
         try {
            // 1. Kiểm tra user đăng nhập
            if (!user || !user.nguoi_dung_id) {
               throw new UnAuthorizedException(
                  "Vui lòng đăng nhập để thêm ảnh"
               );
            }

            // 2. Validate input cực gắt
            if (!ten_hinh || typeof ten_hinh !== "string" || !ten_hinh.trim()) {
               throw new BadRequestException(
                  "Tên hình là bắt buộc và không được để trống"
               );
            }
            if (
               !duong_dan ||
               typeof duong_dan !== "string" ||
               !duong_dan.trim()
            ) {
               throw new BadRequestException("Đường dẫn ảnh là bắt buộc");
            }

            // Kiểm tra URL hợp lệ
            try {
               new URL(duong_dan.trim());
            } catch {
               throw new BadRequestException(
                  "Đường dẫn ảnh không phải là URL hợp lệ"
               );
            }

            const moTa =
               mo_ta && typeof mo_ta === "string" ? mo_ta.trim() || null : null;

            // Giới hạn độ dài theo model
            if (ten_hinh.trim().length > DO_DAI_TEN_HINH)
               throw new BadRequestException(
                  `Tên hình không được quá ${DO_DAI_TEN_HINH} ký tự`
               );
            if (duong_dan.trim().length > DO_DAI_DUONG_DAN)
               throw new BadRequestException(
                  `Đường dẫn không được quá ${DO_DAI_DUONG_DAN} ký tự`
               );
            if (moTa && moTa.length > DO_DAI_MO_TA)
               throw new BadRequestException(
                  `Mô tả không được quá ${DO_DAI_MO_TA} ký tự`
               );

            // 3. KIỂM TRA XEM ĐƯỜNG DẪN ĐÃ TỒN TẠI CHƯA (tránh trùng lặp)
            const existingImage = await tx.hinh_anh.findUnique({
               where: { duong_dan: duong_dan.trim() },
               select: { hinh_id: true },
            });

            if (existingImage) {
               throw new BadRequestException("Hình ảnh này đã tồn tại");
            }

            // 4. TẠO ẢNH MỚI TRONG GIAO DỊCH
            const newImage = await tx.hinh_anh.create({
               data: {
                  ten_hinh: ten_hinh.trim(),
                  duong_dan: duong_dan.trim(),
                  mo_ta: moTa,
                  nguoi_dung_id: user.nguoi_dung_id,
               },
               include: {
                  nguoi_dung: {
                     select: {
                        nguoi_dung_id: true,
                        ho_ten: true,
                        anh_dai_dien: true,
                     },
                  },
               },
            });

            // 5. (TƯƠNG LAI) Có thể thêm log hành động vào bảng audit_log ở đây
            // await tx.audit_log.create({ data: { ... } });

            // TRẢ VỀ KẾT QUẢ – GIAO DỊCH SẼ TỰ COMMIT
            return {
               message: "Thêm ảnh thành công",
               data: newImage,
            };
         } catch (error) {
            // BẤT KỂ LỖI GÌ XẢY RA → GIAO DỊCH SẼ TỰ ĐỘNG ROLLBACK
            // → DB TRỞ LẠI TRẠNG THÁI BAN ĐẦU – KHÔNG BỊ DỮ LIỆU DỞ

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
               if (error.code === "P2002") {
                  throw new BadRequestException(
                     "Đường dẫn ảnh đã tồn tại trong hệ thống"
                  );
               }
            }

            // Ném lại lỗi để global handler xử lý
            throw error;
         }
      });
      // === KẾT THÚC GIAO DỊCH ===
   },

   delete: async (req) => {
      const { hinh_id } = req.params;
      const user = req.user; // lấy user từ middleware protect

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

   /**
    * Lấy danh sách ảnh đã tạo theo userId (nguoi_dung_id)
    * Nên làm phân trang vì 1 user có thể lưu rất nhiều hinh ảnh
    */
   getCreateImageByUserId: async (req) => {
      // Lấy user từ middleware protect
      const user = req.user;
      // Lấy user Id từ params ở postman
      const { nguoi_dung_id } = req.params;

      const userId = validateId(nguoi_dung_id);

      // Kiểm tra user
      if (!user || user.nguoi_dung_id !== userId) {
         throw new UnAuthorizedException(
            `Người dùng ${userId} chưa đăng nhập.`
         );
      }

      //
      const { page, pageSize, filters, skip } = buildQuery(req.query);

      // Lấy danh sách hình ảnh theo nguoi_dung_id
      const imagesPromise = prisma.hinh_anh.findMany({
         where: {
            nguoi_dung_id: userId,
            ...filters,
         },
         skip: skip,
         take: pageSize,
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
               },
            },
         },
         orderBy: { hinh_id: "desc" },
      });

      const totalItemPromise = prisma.hinh_anh.count({
         where: {
            nguoi_dung_id: userId,
            ...filters,
         },
      });

      const [images, totalItem] = await Promise.all([
         imagesPromise,
         totalItemPromise,
      ]);

      const totalPage = Math.ceil(totalItem / pageSize);

      // Trả về danh sách
      return {
         message: "Lấy danh sách ảnh đã tạo theo user thành công",
         pagination: { page, pageSize, totalItem, totalPage },
         images: images || [],
      };
   },

   /**
    * Lấy danh sách ảnh đã tạo theo userId (nguoi_dung_id)
    * Nên làm phân trang vì 1 user có thể lưu rất nhiều hinh ảnh
    */
   getSavedImageByUserId: async (req) => {
      // Lấy user từ middleware protect
      const user = req.user;
      // Lấy user Id từ params ở postman
      const { nguoi_dung_id } = req.params;

      const userId = validateId(nguoi_dung_id);

      // Kiểm tra user
      if (!user || user.nguoi_dung_id !== userId) {
         throw new UnAuthorizedException(
            `Người dùng ${userId} chưa đăng nhập.`
         );
      }

      //
      const { page, pageSize, filters, skip } = buildQuery(req.query);

      // Lấy danh sách hình ảnh đã lưu theo nguoi_dung_id
      const imagesPromise = prisma.luu_anh.findMany({
         where: {
            nguoi_dung_id: userId,
            ...filters,
         },
         skip: skip,
         take: pageSize,
         select: {
            nguoi_dung_id: true,
            hinh_id: true,
            ngay_luu: true,
            hinh_anh: {
               select: {
                  hinh_id: true,
                  ten_hinh: true,
                  duong_dan: true,
                  mo_ta: true,
               },
            },
            nguoi_dung: {
               select: {
                  nguoi_dung_id: true,
                  ho_ten: true,
               },
            },
         },
         orderBy: { ngay_luu: "desc" },
      });

      const totalItemPromise = prisma.hinh_anh.count({
         where: {
            nguoi_dung_id: userId,
            ...filters,
         },
      });

      const [images, totalItem] = await Promise.all([
         imagesPromise,
         totalItemPromise,
      ]);

      const totalPage = Math.ceil(totalItem / pageSize);

      // // Cho Front End biết ảnh này user đã lưu hay chưa?
      // const items = images.map((img) => ({
      //    ...img,
      //    da_luu: img.luu_anh.length > 0,
      //    ngay_luu: img.luu_anh[0]?.ngay_luu || null, // true: đã lưu; false: chưa lưu
      //    luu_anh: undefined,
      // }));

      // Trả về danh sách
      return {
         message: "Lấy danh sách ảnh đã tạo theo user thành công",
         pagination: { page, pageSize, totalItem, totalPage },
         images: images || [],
         // items,
      };
   },
};
