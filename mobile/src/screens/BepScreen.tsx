import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { api, DonHang, TrangThaiDonHang } from '../api/client';
import IconBan from '../components/IconBan';
import { Clock, Flame, CheckCircle2, XCircle, ChefHat } from 'lucide-react-native';

const MAU = {
  nen: '#FFFFFF',
  nenPhu: '#F6F6F7',
  chu: '#1A1A1A',
  chuMo: '#8E8E93',
  nhan: '#D0281E',
  nhanNhat: '#FDECEA',
  vang: '#C27A00',
  vangNhat: '#FFF3DC',
  xanh: '#1E9E5A',
  vien: '#EAEAEA',
};

const THONG_TIN_TRANG_THAI: Record<TrangThaiDonHang, { nhan: string; mau: string; nen: string; Icon: any }> = {
  dang_cho: { nhan: 'Đang chờ', mau: MAU.nhan, nen: MAU.nhanNhat, Icon: Clock },
  dang_lam: { nhan: 'Đang làm', mau: MAU.vang, nen: MAU.vangNhat, Icon: Flame },
  hoan_thanh: { nhan: 'Hoàn thành', mau: MAU.xanh, nen: '#E6F5EC', Icon: CheckCircle2 },
  da_huy: { nhan: 'Đã hủy', mau: MAU.chuMo, nen: '#F1F1F2', Icon: XCircle },
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
  const daKetThuc = don.trangThai === 'hoan_thanh' || don.trangThai === 'da_huy';
  const gio = new Date(don.thoiGianTao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.the, { borderLeftColor: tt.mau }, daKetThuc && { opacity: 0.7 }]}>
      <View style={styles.dauThe}>
        <View style={styles.vongBan}>
          <IconBan size={26} mauBan={MAU.nhan} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.soBan} numberOfLines={1}>{don.soBan || 'Chưa rõ bàn'}</Text>
          <Text style={styles.gio}>Đơn #{don.id} · {gio}</Text>
        </View>
        <View style={[styles.nhanTrangThai, { backgroundColor: tt.nen }]}>
          <tt.Icon size={13} color={tt.mau} strokeWidth={2.4} />
          <Text style={[styles.textNhanTrangThai, { color: tt.mau }]}>{tt.nhan}</Text>
        </View>
      </View>

      <View style={styles.dsMon}>
        {don.chiTiet.map((ct) => (
          <View key={ct.id} style={styles.dongMon}>
            <View style={styles.oSoLuong}>
              <Text style={styles.textSoLuong}>{ct.soLuong}×</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tenMon}>{ct.monAn.ten}</Text>
              {!!ct.ghiChu && (
                <View style={styles.hopGhiChu}>
                  <Text style={styles.textGhiChu}>{ct.ghiChu}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      {!daKetThuc && (
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

// Lưới thẻ: tự chia hàng đúng số cột (không dựa vào flex-wrap), giống Thực đơn
function LuoiDon({
  ds,
  soCot,
  onDoiTrangThai,
}: {
  ds: DonHang[];
  soCot: number;
  onDoiTrangThai: (id: number, trangThai: TrangThaiDonHang) => void;
}) {
  const cacHang: DonHang[][] = [];
  for (let i = 0; i < ds.length; i += soCot) cacHang.push(ds.slice(i, i + soCot));
  return (
    <>
      {cacHang.map((hang, idx) => (
        <View key={idx} style={styles.hangLuoi}>
          {hang.map((don) => (
            <View key={don.id} style={{ flex: 1 }}>
              <TheDon don={don} onDoiTrangThai={onDoiTrangThai} />
            </View>
          ))}
          {Array.from({ length: soCot - hang.length }).map((_, i) => (
            <View key={`trong-${i}`} style={{ flex: 1 }} />
          ))}
        </View>
      ))}
    </>
  );
}

export default function BepScreen() {
  const { width } = useWindowDimensions();
  const soCot = width >= 1000 ? 3 : width >= 650 ? 2 : 1;

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

  // Đơn đang xử lý: đơn cũ nhất lên đầu để bếp làm theo thứ tự
  const donDangXuLy = useMemo(
    () => dsDon.filter((d) => d.trangThai === 'dang_cho' || d.trangThai === 'dang_lam').sort((a, b) => a.id - b.id),
    [dsDon],
  );
  const donXongHoacHuy = useMemo(
    () => dsDon.filter((d) => d.trangThai === 'hoan_thanh' || d.trangThai === 'da_huy').slice(0, 6),
    [dsDon],
  );

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
      <View style={styles.thanTrenCung}>
        <View style={styles.nhomTren}>
          <ChefHat size={20} color={MAU.nhan} strokeWidth={2.2} />
          <Text style={styles.textTren}>{donDangXuLy.length} đơn đang xử lý</Text>
        </View>
        <View style={styles.nhomTren}>
          <View style={[styles.cham, loi ? { backgroundColor: MAU.nhan } : null]} />
          <Text style={styles.textPhuTren}>{loi ? 'Mất kết nối' : 'Tự làm mới mỗi 4s'}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.noiDung}
        refreshControl={<RefreshControl refreshing={dangLamMoi} onRefresh={() => { setDangLamMoi(true); tai(false); }} />}
      >
        {donDangXuLy.length === 0 ? (
          <View style={styles.trongRong}>
            <View style={styles.vongTrong}>
              <ChefHat size={30} color={MAU.chuMo} strokeWidth={1.8} />
            </View>
            <Text style={styles.textTrong}>Chưa có đơn nào đang xử lý</Text>
          </View>
        ) : (
          <LuoiDon ds={donDangXuLy} soCot={soCot} onDoiTrangThai={doiTrangThai} />
        )}

        {donXongHoacHuy.length > 0 && (
          <>
            <Text style={styles.tieuDeNhom}>Đã xong / đã hủy gần đây</Text>
            <LuoiDon ds={donXongHoacHuy} soCot={soCot} onDoiTrangThai={doiTrangThai} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MAU.nen },
  trangThaiGiua: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: MAU.nen },
  textTai: { marginTop: 12, color: MAU.chuMo },

  thanTrenCung: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: MAU.vien,
  },
  nhomTren: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  textTren: { fontSize: 13.5, fontWeight: '700', color: MAU.chu },
  textPhuTren: { fontSize: 12.5, fontWeight: '600', color: MAU.chuMo },
  cham: { width: 8, height: 8, borderRadius: 4, backgroundColor: MAU.xanh },

  noiDung: { padding: 16, paddingBottom: 40 },
  tieuDeNhom: { fontSize: 18, fontWeight: '800', color: MAU.chu, marginTop: 14, marginBottom: 14 },

  trongRong: { alignItems: 'center', paddingVertical: 48 },
  vongTrong: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: MAU.nenPhu,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  textTrong: { fontSize: 16, color: MAU.chuMo, fontWeight: '600' },

  hangLuoi: { flexDirection: 'row', gap: 14, marginBottom: 14 },

  the: {
    backgroundColor: MAU.nen,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: MAU.vien,
    borderLeftWidth: 5,
    padding: 14,
  },
  dauThe: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  vongBan: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: MAU.nhanNhat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soBan: { fontSize: 16, fontWeight: '800', color: MAU.chu },
  gio: { fontSize: 12, color: MAU.chuMo, marginTop: 1, fontWeight: '600' },
  nhanTrangThai: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  textNhanTrangThai: { fontSize: 11.5, fontWeight: '800' },

  dsMon: { gap: 10, paddingVertical: 12, borderTopWidth: 1, borderTopColor: MAU.vien },
  dongMon: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  oSoLuong: {
    minWidth: 34,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: MAU.nenPhu,
    alignItems: 'center',
  },
  textSoLuong: { fontSize: 14, fontWeight: '800', color: MAU.nhan },
  tenMon: { fontSize: 15, fontWeight: '700', color: MAU.chu, paddingTop: 2 },
  hopGhiChu: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: MAU.vangNhat,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  textGhiChu: { fontSize: 12, fontWeight: '700', color: MAU.vang },

  hangNut: { flexDirection: 'row', gap: 10, marginTop: 2 },
  nutHanhDong: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  textNutHanhDong: { color: 'white', fontWeight: '800', fontSize: 14 },
  nutHuy: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: MAU.vien,
    alignItems: 'center',
  },
  textNutHuy: { color: MAU.chuMo, fontWeight: '800', fontSize: 14 },
});