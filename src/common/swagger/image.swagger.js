export const imageSwagger = {
   "/image": {
      get: {
         tags: ["Images"],

         // Show lock symbol, bảo mật bằng Bearer Token
         security: [
            {
               BearerAuth: [],
            },
         ],

         summary: "Trả về danh sách hình ảnh.",
         description: "Danh sách hình ảnh.",

         parameters: [
            {
               in: "query",
               name: "page",
               description: "Page index",
            },
            {
               in: "query",
               name: "pageSize",
               description: "Page size index",
            },
         ],

         responses: {
            200: {
               description: "Lấy thông tin danh sách hình ảnh thành công",
            },
         },
      },
   },

   "/image/get-image-and-nguoi-tao/{hinh_id}": {
      get: {
         tags: ["Images"],

         // Show Lock symbol, bảo mật bằng Bearer
         security: [{ BearerAuth: [] }],

         summary: "Trả về thông tin hình ảnh & người tạo.",
         description: "Trả về thông tin hình ảnh & người tạo.",
         parameters: [
            {
               name: "hinh_id",
               in: "path",
               required: true,
               description: "Nhập ID của hình ảnh",
               schema: { type: "integer" },
            },
            // {...} // trường thông tin thứ 2 (nếu có)
         ],

         responses: {
            200: {
               description: "Lấy thông tin chi tiết hình ảnh thành công",
            },
         },
      },
   },

   "/image/search": {
      get: {
         tags: ["Images"],

         // Show Lock symbol, bảo mật bằng Bearer
         security: [{ BearerAuth: [] }],

         summary: "Trả về danh sách hình ảnh.",
         description: "Trả về danh sách hình ảnh khi người dùng lọc theo tên hình ảnh.",
         parameters: [
            {
               name: "name",
               in: "query",
               required: true,
               description: "Nhập ký tự đại diện của tên hình ảnh",
               schema: { type: "string" },
            },
            // {...} // trường thông tin thứ 2 (nếu có)
         ],

         responses: {
            200: {
               description: "Lấy hình ảnh theo tên thành công",
            },
         },
      },
   },

   "/image/get-comment/{hinh_id}": {
      get: {
         tags: ["Images"],

         // Show Lock symbol, bảo mật bằng Bearer
         security: [{ BearerAuth: [] }],

         summary: "Trả về thông tin bình luận theo hình ảnh.",
         description: "Trả về thông tin bình luận theo hình ảnh.",
         parameters: [
            {
               name: "hinh_id",
               in: "path",
               required: true,
               description: "Nhập ID của hình ảnh",
               schema: { type: "integer" },
            },
            // {...} // trường thông tin thứ 2 (nếu có)
         ],

         responses: {
            200: {
               description: "Lấy thông tin bình luận thành công",
            },
         },
      },
   },

   "/image/upload": {
      post: {
         tags: ["Images"],

         // Show Lock symbol, bảo mật bằng Bearer
         security: [{ BearerAuth: [] }],

         summary: "Trả về thông tin hình ảnh.",
         description: "Trả về thông tin hình ảnh đã lưu.",

         requestBody: {
            description: "Lưu hình ảnh người dùng",
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     properties: {
                        ten_hinh: {
                           type: "string",
                           description: "Tên hình ảnh.",
                           example: "Bãi dài Phú Quốc",
                        },
                        duong_dan: {
                           type: "string",
                           description: "Đường dẫn/link lưu hình ảnh.",
                           example: "/hinhanh/baidaipq.jpg",
                        },
                        mo_ta: {
                           type: "string",
                           description: "Mô tả hình ảnh",
                           example: "Cát trắng mịn, biển xanh mát",
                        }
                     },
                  },
                  example: {
                     ten_hinh: "Bãi dài Phú Quốc",
                     duong_dan: "/hinhanh/baidaipq.jpg",
                     mo_ta: "Cát trắng mịn, biển xanh mát"
                  },
               },
            },
         },

         responses: {
            200: {
               description: "Lưu hình ảnh người dùng",
            },
         },
      },
   },

   "/image/check-saved-image/{hinh_id}": {
      get: {
         tags: ["Images"],

         // Show Lock symbol, bảo mật bằng Bearer
         security: [{ BearerAuth: [] }],

         summary: "Trả về thông tin đã lưu ảnh hay chưa.",
         description: "Kiểm tra người dùng đã lưu ảnh hay chưa.",
         parameters: [
            {
               name: "hinh_id",
               in: "path",
               required: true,
               description: "Nhập ID của hình ảnh",
               schema: { type: "integer" },
            },
            // {...} // trường thông tin thứ 2 (nếu có)
         ],

         responses: {
            200: {
               description: "Kiểm tra người dùng đã lưu ảnh hay chưa",
            },
         },
      },
   },

   "/image/save-comment": {
      post: {
         tags: ["Images"],

         // Show Lock symbol, bảo mật bằng Bearer
         security: [{ BearerAuth: [] }],

         summary: "Trả về thông tin bình luận.",
         description: "Trả về thông tin bình luận đã lưu.",
         // parameters: [
         //    {
         //       name: "hinh_id",
         //       in: "path",
         //       required: true,
         //       description: "Nhập ID của hình ảnh",
         //       schema: { type: "integer" },
         //    },
         // ],

         requestBody: {
            description: "Bình luận hình ảnh",
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     properties: {
                        hinh_id: {
                           type: "integer",
                           description: "ID cảu hình ảnh.",
                           example: 2,
                        },
                        noi_dung: {
                           type: "string",
                           description: "Nội dung bình luận.",
                           example: "Hình này đẹp quá xá",
                        },
                     },
                  },
                  example: {
                     hinh_id: 2,
                     noi_dung: "Hình này đẹp quá xá",
                  },
               },
            },
         },

         responses: {
            200: {
               description: "Lưu bình luận thành công",
            },
         },
      },
   },

   // Xóa ảnh theo hinh_id
   "/image/{hinh_id}": {
      delete: {
         tags: ["Images"],

         // Show Lock symbol, bảo mật bằng Bearer
         security: [{ BearerAuth: [] }],

         summary: "Xóa ảnh theo id ảnh (hinh_id).",
         description: "Xóa hình ảnh theo ID ảnh.",
         parameters: [
            {
               name: "hinh_id",
               in: "path",
               required: true,
               description: "Nhập ID của hình ảnh",
               schema: { type: "integer" },
            },
         ],

         responses: {
            200: {
               description: "Xóa hình ảnh theo ID ảnh thành công.",
            },
         },
      },
   },
};
