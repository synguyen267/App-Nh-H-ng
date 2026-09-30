import React from 'react';
import { Salad, Soup, CakeSlice, CupSoda, UtensilsCrossed } from 'lucide-react-native';

// Icon SVG + màu nhấn theo từng danh mục
export const THONG_TIN_LOAI: Record<string, { Icon: any; mau: string; nen: string }> = {
  'Khai vị': { Icon: Salad, mau: '#2E8B57', nen: '#EAF5EE' },
  'Món chính': { Icon: Soup, mau: '#D0281E', nen: '#FDECEA' },
  'Tráng miệng': { Icon: CakeSlice, mau: '#C27A00', nen: '#FFF3DC' },
  'Nước uống': { Icon: CupSoda, mau: '#2F6FB5', nen: '#E8F1FB' },
};

const MAC_DINH = { Icon: UtensilsCrossed, mau: '#8E8E93', nen: '#F1F1F2' };

export function layThongTinLoai(loai: string) {
  return THONG_TIN_LOAI[loai] || MAC_DINH;
}

export function IconLoai({
  loai,
  size = 20,
  color,
  strokeWidth = 2,
}: {
  loai: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const { Icon, mau } = layThongTinLoai(loai);
  return <Icon size={size} color={color || mau} strokeWidth={strokeWidth} />;
}