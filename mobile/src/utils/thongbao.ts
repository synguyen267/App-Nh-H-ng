import { Alert, Platform } from 'react-native';

// Alert.alert không hiện gì trên trình duyệt, nên dùng alert của trình duyệt khi chạy web
export function thongBao(tieuDe: string, noiDung?: string) {
  if (Platform.OS === 'web') {
    (globalThis as any).alert(noiDung ? `${tieuDe}\n${noiDung}` : tieuDe);
  } else {
    Alert.alert(tieuDe, noiDung);
  }
}