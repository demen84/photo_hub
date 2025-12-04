import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "quyit84@gmail.com",
    pass: "ibgbjtxyboyjpvhb",
  },
});

export const guiMail = async (emailTo, subject = "Chào bạn") => {
  const info = await transporter.sendMail({
    from: "HUY HOANG",
    to: emailTo,
    subject: subject,
    text: "Chào bạn.", // plain‑text body
    html: "<h3>Chào bạn! Đây là email cảnh báo đăng nhập thôi.</h3>", // HTML body
  });

  console.log("Message sent:", info.messageId);
};

// Wrap in an async IIFE (là hàm tạo ra và chạy ngay) so we can use await.
