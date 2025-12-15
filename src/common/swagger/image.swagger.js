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

         summary: "Trả về thông tin chi tiết của 1 hình ảnh.",
         description: "Chi tiết hình ảnh.",
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
};
