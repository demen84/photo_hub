// Số ký tự tối thiểu/tối đa cho mật khẩu
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 20;

/** Loại dấu tiếng Việt và chuyển thành chữ thường (lower case) */
export const stripAccents = (s) =>
   String(s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // bỏ dấu

/** Chuẩn hoá -> ascii, lower-case, bỏ khoảng trắng */
export const toAsciiLowerNoSpaces = (s) =>
   stripAccents(String(s ?? "").toLowerCase()).replace(/\s+/g, "");

/** Tách token tên (họ, tên đệm, tên) theo khoảng trắng/dấu tách, bỏ token ngắn */
export const splitNameTokens = (fullName) =>
   stripAccents(String(fullName ?? "").toLowerCase())
      .split(/[\s._-]+/)
      .filter((t) => t.length >= 3);

/**
 * Kiểm tra mật khẩu theo yêu cầu:
 * - Có chữ HOA, chữ thường, kí tự số, kí tự đặc biệt
 * - KHÔNG chứa khoảng trắng
 * - KHÔNG chứa email (toàn bộ) hoặc 1 phần email (trước @)
 * - KHÔNG chứa họ/tên (kể cả từng phần, bỏ dấu)
 * Trả về mảng errors (rỗng nếu passed).
 */
export const validatePasswordComplexity = (password, emailNorm, hoTenNorm) => {
   const errors = [];

   const pwd = String(password ?? "");
   const hasSpace = /\s/.test(pwd); // ✅ không cho phép khoảng trắng
   const hasUpper = /[A-Z]/.test(pwd); // chữ HOA (ASCII)
   const hasLower = /[a-z]/.test(pwd); // chữ thường (ASCII)
   const hasDigit = /[0-9]/.test(pwd); // kí tự số
   const hasSpecial = /[^A-Za-z0-9]/.test(pwd); // kí tự đặc biệt (ngoài chữ/số)

   // Kiểm tra Độ dài mật khẩu
   if (pwd.length < MIN_PASSWORD_LENGTH || pwd.length > MAX_PASSWORD_LENGTH) {
      errors.push(
         `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự và tối đa ${MAX_PASSWORD_LENGTH} ký tự.`
      );
   }

   // Thành phần bắt buộc
   if (!hasUpper)
      errors.push("Mật khẩu phải có ít nhất 1 ký tự chữ HOA (A–Z).");
   if (!hasLower)
      errors.push("Mật khẩu phải có ít nhất 1 ký tự chữ thường (a–z).");
   if (!hasDigit) errors.push("Mật khẩu phải có ít nhất 1 ký tự số (0–9).");
   if (!hasSpecial)
      errors.push(
         "Mật khẩu phải có ít nhất 1 ký tự đặc biệt (ví dụ: !@#$%^&*...)."
      );

   // Không cho phép khoảng trắng
   if (hasSpace) {
      errors.push("Mật khẩu không được chứa khoảng trắng.");
   }

   // So sánh chống chứa email/họ tên (bỏ dấu, chuyển thành chữ thường, bỏ khoảng trắng)
   const passNormAscii = toAsciiLowerNoSpaces(pwd);
   const emailAscii = toAsciiLowerNoSpaces(emailNorm);
   const emailLocalAscii = toAsciiLowerNoSpaces(
      String(emailNorm).split("@")[0]
   );

   if (emailAscii && passNormAscii.includes(emailAscii)) {
      errors.push("Mật khẩu không được chứa toàn bộ email.");
   }
   if (emailLocalAscii && passNormAscii.includes(emailLocalAscii)) {
      errors.push("Mật khẩu không được chứa phần tên email (trước dấu @).");
   }

   const nameTokens = splitNameTokens(hoTenNorm); // ví dụ: ['ngo','thi','hoa']
   const violatedToken = nameTokens.find((tk) => passNormAscii.includes(tk));
   if (violatedToken) {
      errors.push("Mật khẩu không được chứa họ tên hoặc từng phần họ tên.");
   }

   return errors;
};
