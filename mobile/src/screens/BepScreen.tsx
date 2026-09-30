import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { api, DonHang, TrangThaiDonHang } from '../api/client';
import { Clock, Flame, CheckCircle2, XCircle } from 'lucide-react-native';

const MAU = {
  nen: '#FFFFFF',
  nenPhu: '#F6F6F7',
  chu: '#1A1A1A',
  chuMo: '#8E8E93',
  nhan: '#D0281E',
  vang: '#C27A00',
  xanh: '#1E9E5A',
  vien: '#EAEAEA',
};

const THONG_TIN_TRANG_THAI: Record<TrangThaiDonHang, { nhan: string; mau: string; Icon: any }> = {
  dang_cho: { nhan: 'Đang chờ', mau: MAU.nhan, Icon: Clock },
  dang_lam: { nhan: 'Đang làm', mau: MAU.vang, Icon: Flame },
  hoan_thanh: { nhan: 'Hoàn thành', mau: MAU.xanh, Icon: CheckCircle2 },
  da_huy: { nhan: 'Đã hủy', mau: MAU.chuMo, Icon: XCircle },
};

// Trạng thái kế tiếp khi bếp bấm nút hành động chính
const TRANG_THAI_TIEP_THEO: Partial<Record<TrangThaiDonHang, TrangThaiDonHang>> = {
  dang_cho: 'dang_lam',
  dang_lam: 'hoan_thanh',
};

const NHAN_HANH_DONG: Partial<Record<TrangThaiDonHang, string>> = {
  dang_cho: 'Bắt đầu làm',
  dang_lam: 'Đã xong',
};

function TheDon({
  don,
  onDoiTrangThai,
}: {
  don: DonHang;
  onDoiTrangThai: (id: number, trangThai: TrangThaiDonHang) => void;
}) {
  const tt = THONG_TIN_TRANG_THAI[don.trangThai];
  const hanhDongTiepTheo = TRANG_THAI_TIEP_THEO[don.trangThai];
  const gio = new Date(don.thoiGianTao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.the, { borderColor: tt.mau }]}>
      <View style={styles.dauThe}>
        <View>
          <Text style={styles.soBan}>{don.soBan || 'Chưa rõ bàn'}</Text>
          <Text style={styles.gio}>Đơn #{don.id} · {gio}</Text>
        </View>
        <View style={[styles.nhanTrangThai, { backgroundColor: tt.mau + '1A' }]}>
          <tt.Icon size={13} color={tt.mau} />
          <Text style={[styles.textNhanTrangThai, { color: tt.mau }]}>{tt.nhan}</Text>
        </View>
      </View>

      <View style={styles.dsMon}>
        {don.chiTiet.map((ct) => (
          <Text key={ct.id} style={styles.dongMon}>
            <Text style={styles.soLuongMon}>{ct.soLuong}×</Text> {ct.monAn.ten}
            {ct.ghiChu ? <Text style={styles.ghiChu}>  ({ct.ghiChu})</Text> : null}
          </Text>
        ))}
      </View>

      {(hanhDongTiepTheo || don.trangThai === 'dang_cho') && (
        <View style={styles.hangNut}>
          {hanhDongTiepTheo && (
            <Pressable
              style={[styles.nutHanhDong, { backgroundColor: tt.mau }]}
              onPress={() => onDoiTrangThai(don.id, hanhDongTiepTheo)}
            >
              <Text style={styles.textNutHanhDong}>{NHAN_HANH_DONG[don.trangThai]}</Text>
            </Pressable>
          )}
          {don.trangThai === 'dang_cho' && (
            <Pressable style={styles.nutHuy} onPress={() => onDoiTrangThai(don.id, 'da_huy')}>
              <Text style={styles.textNutHuy}>Hủy</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

export default function BepScreen({ navigation }: any) {
  const [dsDon, setDsDon] = useState<DonHang[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [dangLamMoi, setDangLamMoi] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const dangTaiNgam = useRef(false);

  const tai = useCallback(async (hienLoading = false) => {
    if (dangTaiNgam.current) return;
    dangTaiNgam.current = true;
    if (hienLoading) setDangTai(true);
    try {
      const ds = await api.layDanhSachDonHang();
      setDsDon(ds);
      setLoi(null);
    } catch (e: any) {
      setLoi('Không kết nối được backend');
    } finally {
      dangTaiNgam.current = false;
      setDangTai(false);
      setDangLamMoi(false);
    }
  }, []);

  useEffect(() => {
    tai(true);
    const hen = setInterval(() => tai(false), 4000); // tự làm mới mỗi 4 giây
    return () => clearInterval(hen);
  }, [tai]);

  const doiTrangThai = async (id: number, trangThai: TrangThaiDonHang) => {
    // cập nhật ngay trên giao diện trước, rồi mới gọi API (cảm giác mượt hơn)
    setDsDon((ds) => ds.map((d) => (d.id === id ? { ...d, trangThai } : d)));
    try {
      await api.capNhatTrangThaiDonHang(id, trangThai);
    } catch {
      tai(false); // lỗi thì tải lại cho đúng thực tế
    }
  };

  const donDangXuLy = dsDon.filter((d) => d.trangThai === 'dang_cho' || d.trangThai === 'dang_lam');
  const donXongHoacHuy = dsDon.filter((d) => d.trangThai === 'hoan_thanh' || d.trangThai === 'da_huy');

  if (dangTai) {
    return (
      <View style={styles.trangThaiGiua}>
        <ActivityIndicator size="large" color={MAU.nhan} />
        <Text style={styles.textTai}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.dauTrang}>
        <Text style={styles.tieuDeTrang}>👨‍🍳 Màn hình bếp</Text>
        <Text style={styles.phuDeTrang}>{donDangXuLy.length} đơn đang xử lý · tự làm mới mỗi 4s</Text>
      </View>

      {loi && <Text style={styles.textLoi}>{loi}</Text>}

      <ScrollView
        contentContainerStyle={styles.noiDung}
        refreshControl={<RefreshControl refreshing={dangLamMoi} onRefresh={() => { setDangLamMoi(true); tai(false); }} />}
      >
        {donDangXuLy.length === 0 && (
          <Text style={styles.trongRong}>Chưa có đơn nào đang xử lý 🎉</Text>
        )}
        <View style={styles.luoiThe}>
          {donDangXuLy.map((don) => (
            <View key={don.id} style={styles.oThe}>
              <TheDon don={don} onDoiTrangThai={doiTrangThai} />
            </View>
          ))}
        </View>

        {donXongHoacHuy.length > 0 && (
          <>
            <Text style={styles.tieuDeNhom}>Đã xong / đã hủy gần đây</Text>
            <View style={styles.luoiThe}>
              {donXongHoacHuy.slice(0, 6).map((don) => (
                <View key={don.id} style={styles.oThe}>
                  <TheDon don={don} onDoiTrangThai={doiTrangThai} />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MAU.nenPhu },
  trangThaiGiua: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: MAU.nen },
  textTai: { marginTop: 12, color: MAU.chuMo },
  textLoi: { color: MAU.nhan, textAlign: 'center', paddingVertical: 8, fontSize: 13 },

  dauTrang: { backgroundColor: MAU.nen, padding: 16, borderBottomWidth: 1, borderBottomColor: MAU.vien },
  tieuDeTrang: { fontSize: 20, fontWeight: '800', color: MAU.chu },
  phuDeTrang: { fontSize: 12.5, color: MAU.chuMo, marginTop: 2 },

  noiDung: { padding: 14 },
  trongRong: { textAlign: 'center', color: MAU.chuMo, marginTop: 40, fontSize: 14 },
  tieuDeNhom: { fontSize: 13, fontWeight: '700', color: MAU.chuMo, marginTop: 8, marginBottom: 10, textTransform: 'uppercase' },

  luoiThe: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  oThe: { width: 300 },

  the: {
    backgroundColor: MAU.nen,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
  },
  dauThe: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  soBan: { fontSize: 16, fontWeight: '800', color: MAU.chu },
  gio: { fontSize: 11.5, color: MAU.chuMo, marginTop: 2 },
  nhanTrangThai: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  textNhanTrangThai: { fontSize: 11, fontWeight: '800' },

  dsMon: { marginBottom: 12, gap: 3 },
  dongMon: { fontSize: 13.5, color: MAU.chu },
  soLuongMon: { fontWeight: '800', color: MAU.nhan },
  ghiChu: { fontSize: 12, color: MAU.chuMo, fontStyle: 'italic' },

  hangNut: { flexDirection: 'row', gap: 8 },
  nutHanhDong: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  textNutHanhDong: { color: 'white', fontWeight: '800', fontSize: 13 },
  nutHuy: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: MAU.vien },
  textNutHuy: { color: MAU.chuMo, fontWeight: '700', fontSize: 13 },
});