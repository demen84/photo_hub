export const buildQueryPro = (query) => {
   let { page, pageSize, filters } = query;

   // Parse filters JSON
   filters = JSON.parse(filters || "{}") || {};

   const smartConvertValue = (value) => {
      // Nếu là số dạng string → convert sang number
      if (!isNaN(value) && value.trim() !== "") {
         return Number(value);
      }

      // Nếu là boolean dạng string
      if (value === "true") return true;
      if (value === "false") return false;

      // Nếu là date hợp lệ dạng string (YYYY-MM-DD)
      if (!isNaN(Date.parse(value))) {
         return { equals: new Date(value) };
      }

      // Nếu là array [min, max] → dùng cho range (ngày hoặc số)
      if (Array.isArray(value)) {
         let [gte, lte] = value;

         // convert từng giá trị nếu cần
         if (!isNaN(Date.parse(gte))) gte = new Date(gte);
         if (!isNaN(Date.parse(lte))) lte = new Date(lte);

         return {
            ...(gte ? { gte } : {}),
            ...(lte ? { lte } : {}),
         };
      }

      // Nếu value bắt đầu bằng '=' → exact match
      if (typeof value === "string" && value.startsWith("=")) {
         return { equals: value.substring(1) };
      }

      // Nếu chuỗi nhiều giá trị phân tách bằng "," → tạo mảng
      if (typeof value === "string" && value.includes(",")) {
         return { in: value.split(",").map((v) => v.trim()) };
      }

      // Còn lại là string → contains search
      if (typeof value === "string") {
         return { contains: value };
      }

      return value;
   };

   // Convert tất cả filters
   for (const [key, value] of Object.entries(filters)) {
      filters[key] = smartConvertValue(value);
   }

   // Pagination
   const pageDefault = 1;
   const pageSizeDefault = 3;

   page = Math.max(pageDefault, Number(page) || pageDefault);
   pageSize = Math.max(pageSizeDefault, Number(pageSize) || pageSizeDefault);
   const skip = (page - 1) * pageSize;

   return { page, pageSize, filters, skip };
};
