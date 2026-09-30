import React, { createContext, useContext, useState, useCallback } from 'react';

interface BanContextType {
  soBan: string | null;
  chonBan: (ban: string) => void;
  xoaBan: () => void;
}

const BanContext = createContext<BanContextType | undefined>(undefined);

export function BanProvider({ children }: { children: React.ReactNode }) {
  const [soBan, setSoBan] = useState<string | null>(null);

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