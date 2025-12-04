
USE photohub_db;

SET NAMES utf8mb4;

START TRANSACTION;

-- 1) Users (nguoi_dung)
INSERT INTO nguoi_dung (email, mat_khau, ho_ten, tuoi, anh_dai_dien) VALUES
('quy.tran@example.com',      '$2b$10$quyTranHashXXXX',       'Trần Quốc Quý',       28, '/avatars/u1.jpg'),
('anh.nguyen@example.com',    '$2b$10$anhNguyenHashXXXX',     'Nguyễn Hoàng Anh',    25, '/avatars/u2.jpg'),
('minh.pham@example.com',     '$2b$10$minhPhamHashXXXX',      'Phạm Minh',           31, '/avatars/u3.jpg'),
('hoa.le@example.com',        '$2b$10$hoaLeHashXXXX',         'Lê Thu Hà',           22, '/avatars/u4.jpg'),
('long.tran@example.com',     '$2b$10$longTranHashXXXX',      'Trần Hữu Long',       34, '/avatars/u5.jpg'),
('hanh.bui@example.com',      '$2b$10$hanhBuiHashXXXX',       'Bùi Thúy Hạnh',       29, '/avatars/u6.jpg'),
('khoa.vo@example.com',       '$2b$10$khoaVoHashXXXX',        'Võ Thanh Khoa',       27, '/avatars/u7.jpg'),
('thao.dang@example.com',     '$2b$10$thaoDangHashXXXX',      'Đặng Thảo',           24, '/avatars/u8.jpg'),
('tuan.do@example.com',       '$2b$10$tuanDoHashXXXX',        'Đỗ Tuấn',             33, '/avatars/u9.jpg'),
('my.ngo@example.com',        '$2b$10$myNgoHashXXXX',         'Ngô Mỹ',              21, '/avatars/u10.jpg'),
('quang.nguyen@example.com',  '$2b$10$quangNguyenHashXXXX',   'Nguyễn Quang',        30, '/avatars/u11.jpg'),
('phuong.tran@example.com',   '$2b$10$phuongTranHashXXXX',    'Trần Phương',         26, '/avatars/u12.jpg');

-- 2) Images (hinh_anh) — bổ sung đủ 15 ảnh
INSERT INTO hinh_anh (ten_hinh, duong_dan, mo_ta, nguoi_dung_id) VALUES
('Bình minh biển',      '/images/img1.jpg',  'Bình minh ở Vũng Tàu', 1),
('Cà phê góc phố',      '/images/img2.jpg',  'Quán cà phê nhỏ buổi sáng', 2),
('Đêm Sài Gòn',         '/images/img3.jpg',  'Phố đi bộ Bùi Viện về đêm', 3),
('Hoa giấy trước ngõ',  '/images/img4.jpg',  'Hồng rực rỡ mùa nắng', 4),
('Núi Bà Đen',          '/images/img5.jpg',  'View đỉnh núi Tây Ninh', 5),
('Mèo ngủ trưa',        '/images/img6.jpg',  'Boss lười', 6),
('Bánh tráng phơi sương','/images/img7.jpg', 'Đặc sản Trảng Bàng', 1),
('Lúa chín',            '/images/img8.jpg',  'Cánh đồng vàng', 7),
('Hồ bơi trẻ em',       '/images/img9.jpg',  'Khu hồ bơi sinh thái', 8),
('Cầu vượt Thủ Thiêm',  '/images/img10.jpg', 'Chiều hoàng hôn', 9),
('Miền sông nước',      '/images/img11.jpg', 'Chợ nổi Cần Thơ', 10),
('Bánh mì Sài Gòn',     '/images/img12.jpg', 'Giòn thơm', 11),
('Trải nghiệm camping', '/images/img13.jpg', 'Cắm trại ven hồ', 12),
('Ao câu cá',           '/images/img14.jpg', 'Góc câu cá thư giãn', 5),
('Cafe làm việc',       '/images/img15.jpg', 'Laptop & cà phê', 3); -- ảnh thứ 15

-- 3) Comments (binh_luan) — giữ nguyên, tham chiếu hinh_id 1..15
INSERT INTO binh_luan (nguoi_dung_id, hinh_id, ngay_binh_luan, noi_dung) VALUES
(2, 1, '2025-10-01 08:15:00', 'Ảnh bình minh đẹp quá!'),
(3, 1, '2025-10-01 09:00:00', 'View này chill ghê.'),
(1, 2, '2025-10-02 07:45:00', 'Quán này mình từng ghé.'),
(4, 3, '2025-10-03 21:10:00', 'Đêm Sài Gòn nhộn nhịp.'),
(5, 5, '2025-10-04 10:00:00', 'Leo núi mệt nhưng đáng.'),
(6, 6, '2025-10-04 12:30:00', 'Boss dễ thương quá.'),
(7, 8, '2025-10-05 17:20:00', 'Mùa lúa chín nhìn đã mắt.'),
(8, 9, '2025-10-06 15:00:00', 'Hồ bơi an toàn cho bé không?'),
(9,10, '2025-10-06 18:45:00', 'Góc này lên hình đẹp.'),
(10,11,'2025-10-07 06:40:00', 'Chợ nổi sớm tinh mơ.'),
(11,12,'2025-10-07 09:12:00', 'Bánh mì nhìn hấp dẫn.'),
(12,13,'2025-10-08 19:30:00', 'Camping cuối tuần là nhất.'),
(1, 7, '2025-10-09 11:11:00', 'Đặc sản quê mình đây.'),
(3,15, '2025-10-10 08:00:00', 'Cà phê làm việc năng suất.'),
(2,14, '2025-10-10 16:22:00', 'Ao câu cá hợp chill.'),
(4, 4, '2025-10-11 13:05:00', 'Hoa giấy rực rỡ.'),
(5, 9, '2025-10-11 14:44:00', 'Khu sinh thái cho gia đình ok.'),
(6, 3, '2025-10-12 21:00:00', 'Phố đi bộ đông vui.'),
(7, 5, '2025-10-13 07:07:00', 'Tây Ninh dạo này hot ghê.'),
(8, 2, '2025-10-13 08:08:00', 'Ly cà phê nhìn thơm quá.');

-- 4) Saves (luu_anh) — giữ nguyên, đã có hinh_id=15
INSERT INTO luu_anh (nguoi_dung_id, hinh_id, ngay_luu) VALUES
(1, 1, '2025-10-01 08:20:00'),
(1, 7, '2025-10-09 11:12:00'),
(2, 2, '2025-10-02 07:50:00'),
(2,10, '2025-10-06 18:50:00'),
(3, 3, '2025-10-03 21:12:00'),
(3,15, '2025-10-10 08:05:00'),
(4, 4, '2025-10-11 13:10:00'),
(4, 1, '2025-10-01 09:05:00'),
(5, 5, '2025-10-04 10:10:00'),
(5,14, '2025-10-10 16:25:00'),
(6, 6, '2025-10-04 12:35:00'),
(6, 3, '2025-10-12 21:05:00'),
(7, 8, '2025-10-05 17:25:00'),
(7, 5, '2025-10-13 07:10:00'),
(8, 9, '2025-10-06 15:05:00'),
(8, 2, '2025-10-13 08:10:00'),
(9,10, '2025-10-06 18:55:00'),
(10,11,'2025-10-07 06:45:00');

COMMIT;