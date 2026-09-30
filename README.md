# Đồ án: Quản lý gọi món nhà hàng

Backend NestJS + App di động React Native (Expo).

## Cấu trúc project
```
restaurant-app/
├── backend/     # NestJS API (TypeORM + SQLite)
└── mobile/      # App React Native (Expo) - giao diện bento grid
```

## Chức năng đã làm (mức cơ bản)
- Xem thực đơn theo từng loại món (Khai vị, Món chính, Tráng miệng, Nước uống)
- Thêm món vào giỏ hàng, tăng/giảm số lượng
- Đặt món (tạo đơn hàng), backend tự tính tổng tiền
- Xem lại đơn hàng vừa đặt

## 1. Chạy Backend

```bash
cd backend
npm install --legacy-peer-deps
npm run build
npm run start:prod
```
Backend chạy tại `http://localhost:3000`. Dữ liệu món ăn mẫu sẽ tự động được tạo lần đầu chạy (lưu trong file `nha-hang.sqlite`).

Kiểm tra nhanh: mở trình duyệt `http://localhost:3000/api/monan` sẽ thấy danh sách món ăn dạng JSON.

### Các API chính
| Method | Endpoint                    | Mô tả                          |
|--------|------------------------------|---------------------------------|
| GET    | /api/monan                  | Danh sách món ăn                |
| POST   | /api/monan                  | Thêm món ăn mới                 |
| PUT    | /api/monan/:id              | Sửa món ăn                      |
| DELETE | /api/monan/:id               | Xóa món ăn                      |
| GET    | /api/donhang                | Danh sách đơn hàng               |
| POST   | /api/donhang                | Tạo đơn hàng mới (gọi món)      |
| PUT    | /api/donhang/:id/trangthai  | Cập nhật trạng thái đơn hàng    |

## 2. Chạy App di động (Expo)

**Bước 1 — Tìm địa chỉ IP LAN của máy tính** (điện thoại và máy tính phải cùng mạng Wi-Fi):
- Windows: mở CMD gõ `ipconfig`, tìm dòng "IPv4 Address"
- Mac/Linux: gõ `ifconfig | grep inet`

**Bước 2 — Sửa file `mobile/src/api/config.ts`**, thay `192.168.1.10` bằng IP vừa tìm được:
```ts
export const API_BASE_URL = 'http://<IP_CUA_BAN>:3000';
```

**Bước 3 — Cài và chạy:**
```bash
cd mobile
npm install --legacy-peer-deps
npx expo start
```
Quét mã QR hiện lên bằng app **Expo Go** (tải trên App Store / Google Play) để mở app trên điện thoại thật.

## Ghi chú mở rộng sau này
- Thêm đăng nhập nhân viên: tạo module `auth` với JWT trong backend
- Thêm quản lý bàn/trạng thái bếp: thêm entity `Ban`, mở rộng `TrangThaiDonHang`
- Thêm thống kê doanh thu: query TypeORM group theo ngày trên `DonHang`
