import React, { createContext, useContext, useState, useCallback } from 'react';
import { MonAn, MucGioHang } from '../api/client';

interface GioHangContextType {
  cacMuc: MucGioHang[];
  themVaoGio: (monAn: MonAn) => void;
  giamSoLuong: (monAnId: number) => void;
  xoaKhoiGio: (monAnId: number) => void;
  capNhatGhiChu: (monAnId: number, ghiChu: string) => void;
  xoaTatCa: () => void;
  tongTien: number;
  tongSoLuong: number;
}

const GioHangContext = createContext<GioHangContextType | undefined>(undefined);

export function GioHangProvider({ children }: { children: React.ReactNode }) {
  const [cacMuc, setCacMuc] = useState<MucGioHang[]>([]);

  const themVaoGio = useCallback((monAn: MonAn) => {
    setCacMuc((truoc) => {
      const daCo = truoc.find((m) => m.monAn.id === monAn.id);
      if (daCo) {
        return truoc.map((m) =>
          m.monAn.id === monAn.id ? { ...m, soLuong: m.soLuong + 1 } : m,
        );
      }
      return [...truoc, { monAn, soLuong: 1 }];
    });
  }, []);

  const giamSoLuong = useCallback((monAnId: number) => {
    setCacMuc((truoc) =>
      truoc
        .map((m) => (m.monAn.id === monAnId ? { ...m, soLuong: m.soLuong - 1 } : m))
        .filter((m) => m.soLuong > 0),
    );
  }, []);

  const xoaKhoiGio = useCallback((monAnId: number) => {
    setCacMuc((truoc) => truoc.filter((m) => m.monAn.id !== monAnId));
  }, []);

  const capNhatGhiChu = useCallback((monAnId: number, ghiChu: string) => {
    setCacMuc((truoc) => truoc.map((m) => (m.monAn.id === monAnId ? { ...m, ghiChu } : m)));
  }, []);

  const xoaTatCa = useCallback(() => setCacMuc([]), []);

  const tongTien = cacMuc.reduce((tong, m) => tong + m.monAn.gia * m.soLuong, 0);
  const tongSoLuong = cacMuc.reduce((tong, m) => tong + m.soLuong, 0);

  return (
    <GioHangContext.Provider
      value={{ cacMuc, themVaoGio, giamSoLuong, xoaKhoiGio, capNhatGhiChu, xoaTatCa, tongTien, tongSoLuong }}
    >
      {children}
    </GioHangContext.Provider>
  );
}

export function useGioHang() {
  const ctx = useContext(GioHangContext);
  if (!ctx) throw new Error('useGioHang phải dùng bên trong GioHangProvider');
  return ctx;
}