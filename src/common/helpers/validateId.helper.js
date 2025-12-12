import { BadRequestException } from "./exception.helper.js";

export const validateId = (id, fieldName = "ID") => {
   const so = Number(id);
   if (!id || isNaN(so) || so <= 0 || !Number.isInteger(so)) {
      throw new BadRequestException(
         `${fieldName} phải là số nguyên dương hợp lệ`
      );
   }
   return so;
};
