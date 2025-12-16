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
               // content: {
               //   "application/json": {
               //     schema: {
               //       type: "array",
               //       items: {
               //         type: "string",
               //       },
               //     },
               //   },
               // },
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
