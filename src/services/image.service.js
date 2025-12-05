import { buildQuery } from "../common/helpers/build-query.helper.js";
import prisma from "../common/prisma/connect.prisma.js";

export const imageService = {
   create: async (req) => {
      return `This action create`;
   },

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

   findOne: async (req) => {
      const { id } = req.params; // Lấy id từ params
      // console.log("ID RECEIVED:", id);

      if (!id) throw new Error("Thiếu id trong tham số");
      const image = await prisma.hinh_anh.findUnique({
         where: { hinh_id: Number(id) },
      });
      return image;
   },

   // Tìm kiếm hình ảnh theo tên (có chứa từ khóa, không phân biệt hoa thường)
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

   update: async (req) => {
      return `This action updates a id: ${req.params.id} image`;
   },

   remove: async (req) => {
      return `This action removes a id: ${req.params.id} image`;
   },
};
