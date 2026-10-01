import { Platform } from 'react-native';

// Chạy trên trình duyệt: dùng chính địa chỉ đang mở app (localhost hoặc IP LAN như 192.168.1.10),
// nên điện thoại khách quét QR vẫn gọi được backend.
// Chạy bằng Expo Go trên điện thoại: đổi 'localhost' thành IP LAN của máy chạy backend (xem bằng ipconfig).
const host = Platform.OS === 'web' ? (globalThis as any).location?.hostname || 'localhost' : 'localhost';

export const API_BASE_URL = `http://${host}:4000`;