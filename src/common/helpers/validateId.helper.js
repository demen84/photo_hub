import { BadRequestException } from "./exception.helper.js";

export const validateId = (id, fieldName = "ID") => {
   const num = Number(id);
   if (!id || isNaN(num) || num <= 0 || !Number.isInteger(num)) {
      throw new BadRequestException(
         `${fieldName} phải là số nguyên dương hợp lệ`
      );
   }
   return num;
};
