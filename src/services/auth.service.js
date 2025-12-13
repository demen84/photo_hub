import prisma from "../common/prisma/connect.prisma.js";
import bcrypt from "bcrypt";
import tokenService from "./token.service.js";
import {
   BadRequestException,
   UnAuthorizedException,
} from "../common/helpers/exception.helper.js";
import { guiMail } from "../common/node-mailer/init.node-mailer.js";
import {
   validatePasswordComplexity,
   MIN_PASSWORD_LENGTH,
   MAX_PASSWORD_LENGTH,
} from "../common/helpers/password.helper.js";

const BCRYPT_SALT_ROUNDS = 10; // Số vòng băm recommend
// Thêm hằng số RegEx này ở đầu file hoặc ở đâu đó phù hợp
const EMAIL_REGEX =
   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const authService = {
   /**
    * Đăng ký người dùng mới
    * Người dùng mới có vai trò mặc định là 2 (user) (ko phải ai cũng có quyền tạo user mới có vai trò là 'admin')
    * Muốn đăng ký user mới có quyền admin thì phải tạo API đăng ký riêng.
    */
   register: async (req) => {
      // Lấy dữ liệu từ front end (từ người dùng)
      const { email, mat_khau, ho_ten, tuoi } = req.body || {};

      // Chuẩn hoá email và họ tên
      const emailNorm = String(email ?? "")
         .trim()
         .toLowerCase();
      const hoTenNorm = String(ho_ten ?? "").trim();

      // Ép kiểu tuổi
      const age = Number(tuoi);

      const missing =
         emailNorm === "" ||
         (mat_khau ?? "") === "" ||
         hoTenNorm === "" ||
         tuoi == null ||
         Number.isNaN(age);

      if (missing) {
         throw new BadRequestException(
            "Vui lòng nhập đủ thông tin: email, mật khẩu, họ & tên, tuổi (tuổi phải là số)."
         );
      }

      // ⭐ VALIDATE: Định dạng email hợp lệ
      if (!EMAIL_REGEX.test(emailNorm)) {
         throw new BadRequestException(
            "Địa chỉ email không hợp lệ. Email phải có dạng example@gmail.com"
         );
      }

      // Kiểm tra trùng email
      const userExist = await prisma.nguoi_dung.findUnique({
         where: { email: emailNorm },
         select: { nguoi_dung_id: true },
      });

      //Nếu có user rồi thì báo lỗi
      if (userExist) {
         throw new BadRequestException(
            `Email: ${email} đã tồn tại. Vui lòng nhập email khác.`
         );
      }

      // ✅ Kiểm tra mật khẩu nâng cao (bao gồm không cho phép khoảng trắng)
      const pwErrors = validatePasswordComplexity(
         mat_khau,
         emailNorm,
         hoTenNorm
      );
      if (pwErrors.length) {
         // Có thể trả mảng lỗi cho FE, hoặc gộp message:
         throw new BadRequestException(pwErrors.join(" "));
      }

      // Validate: tuổi là số nguyên trong khoảng cho phép
      const minAge = 16, maxAge = 90;
      if (!Number.isInteger(age) || age < minAge || age > maxAge) {
         throw new BadRequestException(
            `Tuổi phải là số nguyên từ ${minAge} đến ${maxAge}.`
         );
      }

      /**
       * Xử lý Mã hóa mật khẩu dùng hash256 (băm - không thể dịch ngược)
       * ! Dùng bcrypt.hash thay vì bcrypt.hashSync vì:
       * ! 1. Tránh chặn (block) event loop của Node.js
       * hashSync() là hàm đồng bộ: nó sẽ chiếm CPU để băm mật khẩu cho đến khi xong rồi mới trả kết quả. Trong thời gian đó, event loop bị “đứng”, các request khác không được xử lý.
       * hash() là bất đồng bộ: tác vụ băm được đẩy sang libuv thread pool chạy nền. Event loop vẫn rảnh để xử lý các request khác → bảo toàn độ trễ (latency) và tăng thông lượng (throughput) của API.
       * ! 2. Băm mật khẩu là tác vụ nặng CPU
       * Bcrypt cố ý “chậm” để chống brute-force. Với saltRounds = 10–12, mỗi lần hash có thể mất vài chục đến vài trăm ms tuỳ máy.
       * Nếu dùng hashSync() trong route Express, 10–50 request đồng thời có thể khiến server đơ thoáng hoặc timeout.
       * ! 3. Khả năng mở rộng (scalability)
       * Backend phục vụ nhiều người dùng cần không blocking: I/O (DB, network) + CPU nặng (hashing) nên đi theo lối async để tận dụng thread pool, tránh nghẽn ở main thread.
       * ! 4.  Kiến trúc sạch và “future-proof”
       * Async tương thích tốt với await/Promise, dễ compose với các thao tác async khác (gọi DB, gửi email…), dễ thêm rate-limit, queue, hoặc chuyển sang background job sau này.
       */
      const bamMatKhau = await bcrypt.hash(mat_khau, BCRYPT_SALT_ROUNDS); //5 or 10 là độ phức tạp của thuật toán băm

      // Lưu thông tin người dùng (nguoi_dung) vào db
      const nguoi_dung_moi = await prisma.nguoi_dung.create({
         data: {
            email: email,
            mat_khau: bamMatKhau,
            ho_ten: ho_ten,
            tuoi: Number(tuoi),
         },
         select: {
            //trả về các trường thông tin cần thiết, không có mat_khau
            nguoi_dung_id: true,
            email: true,
            ho_ten: true,
            tuoi: true,
            anh_dai_dien: true,
            vai_tro: {
               select: { vai_tro_id: true, ten_vai_tro: true },
            },
         },
      });

      return nguoi_dung_moi;
   },

   registerAdmin: async (req) => {
      // req.user đã là admin (do adminProtect)
      const { email, mat_khau, ho_ten, tuoi } = req.body;

      // Validate...

      const newUserAdmin = await prisma.nguoi_dung.create({
         data: {
            email,
            mat_khau: hashedPassword,
            ho_ten,
            tuoi,
            vai_tro_id: 1, // ÉP CHẶT LÀ ADMIN
         },
      });

      return { message: "Tạo user admin thành công", data: newUserAdmin };
   },

   login: async (req) => {
      // Lấy dữ liệu từ front end (từ người dùng)
      const { email, mat_khau } = req.body;
      const COMMON_LOGIN_ERROR = "Email hoặc mật khẩu không hợp lệ.";

      // Ràng buộc đầu vào: kiểm tra dữ liệu hợp lệ
      if (!email || !mat_khau) {
         throw new BadRequestException(
            `Vui lòng cung cấp đầy đủ thông tin: email, mat_khau.`
         );
      }
      const normalizedEmail = email.trim().toLowerCase();

      if (!EMAIL_REGEX.test(normalizedEmail)) {
         throw new BadRequestException(COMMON_LOGIN_ERROR);
      }

      // Tìm user có trường email bằng với giá trị email lấy từ req.body
      const userExist = await prisma.nguoi_dung.findUnique({
         where: { email: normalizedEmail },
         select: {
            nguoi_dung_id: true,
            mat_khau: true,
            ho_ten: true,
            tuoi: true,
            anh_dai_dien: true,
            email: true,
         },
      });

      // Kiểm tra user có tồn tại trong db không
      if (!userExist) {
         throw new BadRequestException(COMMON_LOGIN_ERROR); // thông báo chung chung để hacker khó đoán là đang sai email hay mật khẩu
      }

      /**
       * Kiểm tra mật khẩu
       * !Lưu ý: Mật khẩu trong db là mật khẩu đã mã hóa, nên ta không thể so sánh trực tiếp được
       * !Nên ta dùng bcrypt.compareSync( mật khẩu người dùng nhập, mật khẩu đã mã hóa trong db )
       * !Hàm này sẽ trả về true/false
       * !Nếu true thì đăng nhập thành công, nếu false thì đăng nhập thất bại
       */
      const isPassword = await bcrypt.compare(mat_khau, userExist.mat_khau);

      if (!isPassword) {
         throw new BadRequestException(COMMON_LOGIN_ERROR); // thông báo chung chung để hacker khó đoán là đang sai email hay mật khẩu
      }

      //Xử lý trả về token (tạo tokens):
      const tokens = tokenService.createToken(userExist.nguoi_dung_id);

      // guiMail(emailTo, subject);
      // guiMail("quyit84@gmail.com", "Cảnh báo đăng nhập");

      /**
       * ! Lợi ích của việc return thêm thông tin user:
       * 1. Vì FE cần hiển thị và giữ thông tin người dùng ngay sau login
       * 2. Thuận tiện, an toàn, FE lấy thông tin nhanh
       * 3. Đúng chuẩn RESTFul hiện đại
       * 4. Giảm số lần request (gọi) API
       */
      return {
         user: {
            nguoi_dung_id: userExist.nguoi_dung_id,
            ho_ten: userExist.ho_ten,
            email: userExist.email,
            tuoi: userExist.tuoi,
            anh_dai_dien: userExist.anh_dai_dien,
         },
         tokens,
      };
   },

   getInfo: async (req) => {
      // delete req.user.mat_khau; //Vì req.user ko có select mat_khau nên ko cần dòng delete req.user.mat_khau này.
      return req.user;
   },

   googleCallback: async (req) => {
      // console.log("SERVICE: ", req.user);
      const { accessToken, refreshToken } = tokenService.createToken(
         req.user.id
      );

      console.log({ accessToken, refreshToken });

      return `http://localhost:3000/login-callback?accessToken=${accessToken}&refreshToken=${refreshToken}`; //có /login-callback là vì FE đã setup như vậy.
   },

   // Phương thức làm mới Token
   refreshToken: async (req) => {
      const { accessToken, refreshToken } = req.body;

      const decodeAccessToken = tokenService.verifyAccessToken(accessToken, {
         ignoreExpiration: true,
      }); // ignoreExpiration: true - bỏ qua kiểm tra hết hạn accessToken; false: có kiểm tra
      const decodeRefreshToken = tokenService.verifyRefreshToken(refreshToken);

      // !Khi accessToken & refreshToken đều là hợp lệ, tuy nhiên nếu chúng có userId khác nhau (vd: userId của accessToken là 2, userId của refreshToken là 5). Khi đó ta phải kiểm tra thêm bước này để đảm bảo là cùng 1 userId:
      if (decodeAccessToken.userId !== decodeRefreshToken.userId) {
         throw new UnAuthorizedException(
            `Token không hợp lệ, vì accessToken & refreshToken không cùng 1 Token(userId)`
         );
      }

      // Kiểm tra userId có thật sự tồn tại trong db không?
      const userExist = await prisma.nguoi_dung.findUnique({
         where: { nguoi_dung_id: decodeAccessToken.userId },
      });
      if (!userExist) {
         // Nếu không tồn tại userId trong db thì ném ra lỗi
         throw new UnAuthorizedException(`Người dùng không tồn tại.`);
      }

      // Kiểm tra user có bị blacklist/banned hay không?
      // ...???

      // Khi kiểm tra các cases xong thì Tạo Token dựa vào userId
      // Trường hợp 1: trả 2 cặp token
      // Chỉ khi khoảng thời gian hết hạn của refreshToken mà người dùng không đăng nhập => login lại
      const tokens = tokenService.createToken(userExist.nguoi_dung_id);

      // Case 2: chỉ trả accessToken mới
      console.log("DECODED:", {
         accessToken,
         refreshToken,
         decodeAccessToken,
         decodeRefreshToken,
      });

      return tokens;
   },
};
