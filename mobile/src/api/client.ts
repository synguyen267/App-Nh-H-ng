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

async function xuLyPhanHoi(res: Response) {
  if (!res.ok) {
    const loi = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(loi.message || 'Có lỗi xảy ra');
  }
  return res.json();
}

export const api = {
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

  layDanhSachDonHang: async (): Promise<DonHang[]> => {
    const res = await fetch(`${API_BASE_URL}/api/donhang`);
    return xuLyPhanHoi(res);
  },

  capNhatTrangThaiDonHang: async (id: number, trangThai: TrangThaiDonHang): Promise<DonHang> => {
    const res = await fetch(`${API_BASE_URL}/api/donhang/${id}/trangthai`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trangThai }),
    });
    return xuLyPhanHoi(res);
  },
};