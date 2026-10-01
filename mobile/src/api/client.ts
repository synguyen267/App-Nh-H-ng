import { API_BASE_URL } from './config';

export interface MonAn {
  id: number;
  ten: string;
  gia: number;
  moTa?: string;
  loai: string;
  hinhAnh?: string;
  conHang: boolean;
}

export interface MucGioHang {
  monAn: MonAn;
  soLuong: number;
  ghiChu?: string;
}

export interface ChiTietDonHang {
  id: number;
  monAnId: number;
  soLuong: number;
  donGia: number;
  ghiChu?: string;
  monAn: MonAn;
}

export interface LuotGoi {
  id: number;
  soBan: string;
  thoiGian: string;
}

export type TrangThaiDonHang = 'dang_cho' | 'dang_lam' | 'hoan_thanh' | 'da_huy';

export interface DonHang {
  id: number;
  soBan?: string;
  trangThai: TrangThaiDonHang;
  tongTien: number;
  thoiGianTao: string;
  chiTiet: ChiTietDonHang[];
}

// Ảnh lưu trong DB có thể là link đầy đủ (http...) hoặc đường dẫn nội bộ (/images/xxx.jpg)
export function layUrlAnh(hinhAnh?: string | null): string | null {
  if (!hinhAnh) return null;
  if (/^https?:\/\//i.test(hinhAnh)) return hinhAnh;
  return `${API_BASE_URL}${hinhAnh.startsWith('/') ? '' : '/'}${hinhAnh}`;
}

// Mã PIN nhân viên, giữ trong bộ nhớ (tắt app là phải nhập lại)
let pinNhanVien = '';
export const daDangNhapNhanVien = () => !!pinNhanVien;
const headerNV = () => ({ 'Content-Type': 'application/json', 'x-pin': pinNhanVien });

async function xuLyPhanHoi(res: Response) {
  if (res.status === 401) pinNhanVien = '';
  if (!res.ok) {
    const loi = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(loi.message || 'Có lỗi xảy ra');
  }
  return res.json();
}

export const api = {
  dangNhapNhanVien: async (pin: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/dangnhap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    await xuLyPhanHoi(res);
    pinNhanVien = pin;
  },

  layDanhSachMonAn: async (): Promise<MonAn[]> => {
    const res = await fetch(`${API_BASE_URL}/api/monan`);
    return xuLyPhanHoi(res);
  },

  taoDonHang: async (soBan: string, danhSachMon: { monAnId: number; soLuong: number; ghiChu?: string }[]): Promise<DonHang> => {
    const res = await fetch(`${API_BASE_URL}/api/donhang`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soBan, danhSachMon }),
    });
    return xuLyPhanHoi(res);
  },

  goiNhanVien: async (soBan: string): Promise<LuotGoi> => {
    const res = await fetch(`${API_BASE_URL}/api/goinhanvien`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soBan }),
    });
    return xuLyPhanHoi(res);
  },

  layDanhSachGoi: async (): Promise<LuotGoi[]> => {
    const res = await fetch(`${API_BASE_URL}/api/goinhanvien`, { headers: headerNV() });
    return xuLyPhanHoi(res);
  },

  xuLyGoi: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/api/goinhanvien/${id}`, { method: 'DELETE', headers: headerNV() });
    return xuLyPhanHoi(res);
  },

  layDanhSachDonHang: async (): Promise<DonHang[]> => {
    const res = await fetch(`${API_BASE_URL}/api/donhang`, { headers: headerNV() });
    return xuLyPhanHoi(res);
  },

  capNhatTrangThaiDonHang: async (id: number, trangThai: TrangThaiDonHang): Promise<DonHang> => {
    const res = await fetch(`${API_BASE_URL}/api/donhang/${id}/trangthai`, {
      method: 'PUT',
      headers: headerNV(),
      body: JSON.stringify({ trangThai }),
    });
    return xuLyPhanHoi(res);
  },
};