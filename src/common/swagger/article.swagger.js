export const articleSwagger = {
   "/article": {
      get: {
         tags: ["Articles"],
         summary: "Trả về danh sách bài viết.",
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
         description: "Ghi chú gì đó tại đây.",
         responses: {
            200: {
               description: "Mảng JSON tên bài viết",
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

   "/article/{id}": {
      // "/article/{id}/{email}/...": {
      get: {
         tags: ["Articles"],
         summary: "Trả về chi tiết bài viết.",
         parameters: [
            {
               in: "path",
               name: "id",
               //   schema: {
               //     type: "integer",
               //   },
               required: true,
               description: "Nhập ID của bài viết để lấy thông tin",
            },
            // {
            //   in: "path",
            //   name: "email",
            //   //   schema: {
            //   //     type: "string",
            //   //   },
            //   required: true,
            //   description: "Nhập thông tin email",
            // },
         ],
         description: "Ghi chú gì đó tại đây.",
         responses: {
            200: {
               description: "Mảng JSON chứa tên bài viết",
            },
         },
      },
   },
};
