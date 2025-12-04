-- =========================
-- TẠO DATABASE & CHỌN DB
-- =========================
DROP DATABASE IF EXISTS photohub_db;
CREATE DATABASE photohub_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE photohub_db;

-- =========================
-- BẢNG: nguoi_dung (Users)
-- =========================
CREATE TABLE nguoi_dung (
  nguoi_dung_id INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  mat_khau      VARCHAR(255) NOT NULL,          -- có thể lưu bcrypt hash
  ho_ten        VARCHAR(255) NOT NULL,
  tuoi          TINYINT UNSIGNED,               -- tuỳ MySQL, CHECK có thể bị bỏ qua trên bản cũ
  anh_dai_dien  VARCHAR(500)                    -- URL hoặc path
) ENGINE=InnoDB;

-- =========================
-- BẢNG: hinh_anh (Images)
-- =========================
CREATE TABLE hinh_anh (
  hinh_id        INT AUTO_INCREMENT PRIMARY KEY,
  ten_hinh       VARCHAR(255) NOT NULL,
  duong_dan      VARCHAR(500) NOT NULL,
  mo_ta          VARCHAR(500),
  nguoi_dung_id  INT NOT NULL,                  -- người đăng ảnh
  CONSTRAINT fk_hinh_nguoidung
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX idx_hinh_nguoidung (nguoi_dung_id)
) ENGINE=InnoDB;

-- =========================
-- BẢNG: binh_luan (Comments)
-- =========================
CREATE TABLE binh_luan (
  binh_luan_id    INT AUTO_INCREMENT PRIMARY KEY,
  nguoi_dung_id   INT NOT NULL,                 -- người bình luận
  hinh_id         INT NOT NULL,                 -- ảnh được bình luận
  ngay_binh_luan  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  noi_dung        VARCHAR(500) NOT NULL,
  INDEX idx_bl_nguoidung (nguoi_dung_id),
  INDEX idx_bl_hinh (hinh_id),
  CONSTRAINT fk_bl_nguoidung
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_bl_hinh
    FOREIGN KEY (hinh_id) REFERENCES hinh_anh(hinh_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- BẢNG: luu_anh (Save Images - N-N)
-- =========================
CREATE TABLE luu_anh (
  nguoi_dung_id INT NOT NULL,
  hinh_id       INT NOT NULL,
  ngay_luu      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (nguoi_dung_id, hinh_id),         -- khoá chính tổng hợp tránh lưu trùng
  CONSTRAINT fk_luu_nguoidung
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_luu_hinh
    FOREIGN KEY (hinh_id) REFERENCES hinh_anh(hinh_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX idx_luu_hinh (hinh_id)
) ENGINE=InnoDB;
