import React, { createContext, useContext, useState, useCallback } from 'react';
import { Platform } from 'react-native';

// Khách quét QR trên bàn sẽ mở app với đường dẫn dạng /?ban=5 -> tự chọn "Bàn 5"
export function banTuUrl(): string | null {
  if (Platform.OS !== 'web') return null;
  const n = new URLSearchParams((globalThis as any).location?.search || '').get('ban');
  return n && /^\d{1,3}$/.test(n) ? `Bàn ${Number(n)}` : null;
}

interface BanContextType {
  soBan: string | null;
  chonBan: (ban: string) => void;
  xoaBan: () => void;
}

const BanContext = createContext<BanContextType | undefined>(undefined);

export function BanProvider({ children }: { children: React.ReactNode }) {
  const [soBan, setSoBan] = useState<string | null>(banTuUrl);

  const chonBan = useCallback((ban: string) => setSoBan(ban), []);
  const xoaBan = useCallback(() => setSoBan(null), []);

  return (
    <BanContext.Provider value={{ soBan, chonBan, xoaBan }}>
      {children}
    </BanContext.Provider>
  );
}

export function useBan() {
  const ctx = useContext(BanContext);
  if (!ctx) throw new Error('useBan phải dùng bên trong BanProvider');
  return ctx;
}