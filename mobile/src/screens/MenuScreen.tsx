import React, { useEffect, useState, useMemo } from 'react';
import IconBan from '../components/IconBan';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { api, MonAn } from '../api/client';
import { useGioHang } from '../context/GioHangContext';
import { useBan } from '../context/BanContext';
import AnhMon from '../components/AnhMon';
import { IconLoai } from '../components/IconLoai';
import { Plus, Minus, X, ShoppingCart, Bell, Check } from 'lucide-react-native';
import { thongBao } from '../utils/thongbao';

const MAU = {
  nen: '#FFFFFF',
  nenPhu: '#F6F6F7',
  chu: '#1A1A1A',
  chuMo: '#8E8E93',
  nhan: '#D0281E',
  vien: '#EAEAEA',
};

const DANH_SACH_LOAI = ['Khai vị', 'Món chính', 'Tráng miệng', 'Nước uống'];
// Nút thêm / bộ đếm
function NutThem({
  soLuong,
  onThem,
  onBot,
  tat,
}: {
  soLuong: number;
  onThem: () => void;
  onBot: () => void;
  tat?: boolean; // món hết hàng: không cho thêm
}) {
  if (soLuong === 0) {
    return (
      <Pressable
        style={[styles.nutThem, tat && styles.nutThemTat]}
        onPress={onThem}
        disabled={tat}
      >
        <Plus size={14} color={tat ? MAU.chuMo : MAU.nhan} strokeWidth={3} />
        <Text style={[styles.textNutThem, tat && { color: MAU.chuMo }]}>Thêm</Text>
      </Pressable>
    );
  }
  return (
    <View style={styles.stepper}>
      <Pressable style={styles.nutStepper} onPress={onBot} hitSlop={6}>
        <Minus size={16} color={MAU.chu} strokeWidth={3} />
      </Pressable>
      <Text style={styles.soLuongStepper}>{soLuong}</Text>
      <Pressable
        style={[styles.nutStepper, styles.nutStepperDam, tat && styles.nutStepperTat]}
        onPress={onThem}
        disabled={tat}
        hitSlop={6}
      >
        <Plus size={16} color="white" strokeWidth={3} />
      </Pressable>
    </View>
  );
}

function TheMon({
  mon,
  soLuong,
  onXem,
  onThem,
  onBot,
}: {
  mon: MonAn;
  soLuong: number;
  onXem: () => void;
  onThem: () => void;
  onBot: () => void;
}) {
  const hetHang = !mon.conHang;
  return (
    <View style={styles.theMon}>
      <Pressable onPress={onXem}>
        <View>
          <AnhMon mon={mon} style={[styles.anhThe, hetHang && { opacity: 0.4 }]} />
          {hetHang && (
            <View style={styles.nhanHetHang}>
              <Text style={styles.textNhanHetHang}>Hết hàng</Text>
            </View>
          )}
        </View>
      </Pressable>
      <View style={styles.noiDungThe}>
        <Text style={styles.tenMon} numberOfLines={1}>{mon.ten}</Text>
        <Text style={styles.moTaMon} numberOfLines={2}>{mon.moTa || ' '}</Text>
        <View style={styles.hangDuoiThe}>
          <Text style={[styles.giaMon, hetHang && { color: MAU.chuMo }]}>{mon.gia.toLocaleString('vi-VN')}đ</Text>
          <NutThem soLuong={soLuong} onThem={onThem} onBot={onBot} tat={hetHang} />
        </View>
      </View>
    </View>
  );
}

export default function MenuScreen({ navigation }: any) {
  const { width } = useWindowDimensions();
  const soCot = width >= 900 ? 3 : 2;
  const sidebarRong = width >= 700 ? 190 : 78;
  const sidebarRong_ngang = width >= 700;

  const [dsMonAn, setDsMonAn] = useState<MonAn[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [dangLamMoi, setDangLamMoi] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [loaiDangChon, setLoaiDangChon] = useState(DANH_SACH_LOAI[0]);
  const [monXem, setMonXem] = useState<MonAn | null>(null);
  const { cacMuc, themVaoGio, giamSoLuong, tongSoLuong, tongTien } = useGioHang();
  const { soBan } = useBan();
  const [dangGoi, setDangGoi] = useState(false);
  const [daGoi, setDaGoi] = useState(false);

  const goiNhanVien = async () => {
    if (!soBan || dangGoi || daGoi) return;
    setDangGoi(true);
    try {
      await api.goiNhanVien(soBan);
      setDaGoi(true);
      setTimeout(() => setDaGoi(false), 30000); // 30 giây sau mới cho gọi lại, tránh bấm liên tục
    } catch {
      thongBao('Không gọi được nhân viên', 'Vui lòng thử lại hoặc vẫy tay gọi nhân viên');
    } finally {
      setDangGoi(false);
    }
  };

  const tai = async () => {
    try {
      setLoi(null);
      const ds = await api.layDanhSachMonAn();
      setDsMonAn(ds);
      if (ds.length > 0 && !ds.find((m) => m.loai === loaiDangChon)) {
        setLoaiDangChon(ds[0].loai);
      }
    } catch (e: any) {
      setLoi('Không kết nối được backend. Kiểm tra API_BASE_URL trong src/api/config.ts');
    } finally {
      setDangTai(false);
      setDangLamMoi(false);
    }
  };

  useEffect(() => {
    tai();
  }, []);

  const soLuongTrongGio = useMemo(() => {
    const map = new Map<number, number>();
    for (const m of cacMuc) map.set(m.monAn.id, m.soLuong);
    return map;
  }, [cacMuc]);

  const danhSachLoaiThucTe = useMemo(() => {
    const cos = new Set(dsMonAn.map((m) => m.loai));
    return DANH_SACH_LOAI.filter((l) => cos.has(l));
  }, [dsMonAn]);

  // Chia món thành từng hàng đúng số cột, tự tính (không dựa vào flex-wrap)
  const cacHang = useMemo(() => {
    const ds = dsMonAn.filter((m) => m.loai === loaiDangChon);
    const hang: MonAn[][] = [];
    for (let i = 0; i < ds.length; i += soCot) hang.push(ds.slice(i, i + soCot));
    return hang;
  }, [dsMonAn, loaiDangChon, soCot]);

  if (dangTai) {
    return (
      <View style={styles.trangThaiGiua}>
        <ActivityIndicator size="large" color={MAU.nhan} />
        <Text style={styles.textTai}>Đang tải thực đơn...</Text>
      </View>
    );
  }

  if (loi) {
    return (
      <View style={styles.trangThaiGiua}>
        <Text style={styles.textLoi}>{loi}</Text>
        <Pressable style={styles.nutThuLai} onPress={tai}>
          <Text style={styles.textNutThuLai}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  const soLuongModal = monXem ? soLuongTrongGio.get(monXem.id) || 0 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: MAU.nen }}>
      <View style={styles.thanhBan}>
       
       <View style={styles.nhomBan}>
  <IconBan size={20} />
  <Text style={styles.textBan}>{soBan || 'Chưa chọn bàn'}</Text>
</View>

        <View style={styles.nhomPhai}>
          <Pressable
            style={[styles.nutGoi, daGoi && styles.nutGoiXong]}
            onPress={goiNhanVien}
            disabled={!soBan || dangGoi || daGoi}
          >
            {daGoi ? (
              <Check size={14} color="#1E9E5A" strokeWidth={3} />
            ) : (
              <Bell size={14} color={MAU.nhan} strokeWidth={2.6} />
            )}
            <Text style={[styles.textNutGoi, daGoi && { color: '#1E9E5A' }]}>
              {daGoi ? 'Đã gọi nhân viên' : 'Gọi nhân viên'}
            </Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('ChonBan')}>
            <Text style={styles.doiBan}>Đổi bàn</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.thanChinh}>
        {/* Sidebar danh mục - hẹp bên trái */}
        <View style={[styles.sidebar, { width: sidebarRong }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.tieuDeSidebar}>{sidebarRong_ngang ? 'Thực đơn' : ''}</Text>
            {danhSachLoaiThucTe.map((loai) => {
              const dangChon = loai === loaiDangChon;
              const soMon = dsMonAn.filter((m) => m.loai === loai).length;
              return (
                <Pressable
                  key={loai}
                  onPress={() => setLoaiDangChon(loai)}
                  style={[
                    styles.oDanhMuc,
                    sidebarRong_ngang ? styles.oDanhMucNgang : styles.oDanhMucDoc,
                    dangChon && styles.oDanhMucDangChon,
                  ]}
                >
                  <IconLoai loai={loai} size={20} color={dangChon ? MAU.nhan : MAU.chuMo} />
                  <Text
                    style={[styles.textDanhMuc, dangChon && styles.textDanhMucDangChon]}
                    numberOfLines={2}
                  >
                    {loai}
                  </Text>
                  {sidebarRong_ngang && <Text style={styles.soMon}>{soMon}</Text>}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Lưới món: mỗi hàng `soCot` ô to có ảnh */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.noiDungLuoi}
          refreshControl={
            <RefreshControl refreshing={dangLamMoi} onRefresh={() => { setDangLamMoi(true); tai(); }} />
          }
        >
          <View style={styles.hangTieuDeLuoi}>
            <IconLoai loai={loaiDangChon} size={24} />
            <Text style={styles.tieuDeLuoi}>{loaiDangChon}</Text>
          </View>
          {cacHang.map((hang, idx) => (
            <View key={idx} style={styles.hangLuoi}>
              {hang.map((mon) => (
                <View key={mon.id} style={{ flex: 1 }}>
                  <TheMon
                    mon={mon}
                    soLuong={soLuongTrongGio.get(mon.id) || 0}
                    onXem={() => setMonXem(mon)}
                    onThem={() => themVaoGio(mon)}
                    onBot={() => giamSoLuong(mon.id)}
                  />
                </View>
              ))}
              {Array.from({ length: soCot - hang.length }).map((_, i) => (
                <View key={`trong-${i}`} style={{ flex: 1 }} />
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Thanh giỏ hàng đỏ dưới đáy */}
      {tongSoLuong > 0 && (
        <View style={styles.thanhGioHang}>
          <ShoppingCart size={22} color="white" strokeWidth={2.2} />
          <View style={styles.badgeSoLuong}>
            <Text style={styles.textBadge}>{tongSoLuong}</Text>
          </View>
          <Text style={styles.textThanhGioHangGia}>{tongTien.toLocaleString('vi-VN')}đ</Text>
          <Pressable style={styles.nutXemGio} onPress={() => navigation.navigate('GioHang')}>
            <Text style={styles.textNutXemGio}>Xem giỏ hàng</Text>
          </Pressable>
        </View>
      )}

      {/* Bấm vào ảnh món -> xem ảnh lớn */}
      <Modal
        visible={!!monXem}
        transparent
        animationType="fade"
        onRequestClose={() => setMonXem(null)}
      >
        <Pressable style={styles.nenModal} onPress={() => setMonXem(null)}>
          {monXem && (
            <Pressable style={styles.hopModal} onPress={() => {}}>
              <AnhMon mon={monXem} style={styles.anhModal} coLon />
              <View style={{ padding: 18 }}>
                <Text style={styles.tenModal}>{monXem.ten}</Text>
                {monXem.moTa ? <Text style={styles.moTaModal}>{monXem.moTa}</Text> : null}
                {!monXem.conHang && <Text style={styles.textHetHangModal}>Món này tạm thời hết hàng</Text>}
                <View style={styles.hangDuoiModal}>
                  <Text style={styles.giaModal}>{monXem.gia.toLocaleString('vi-VN')}đ</Text>
                  <NutThem
                    soLuong={soLuongModal}
                    onThem={() => themVaoGio(monXem)}
                    onBot={() => giamSoLuong(monXem.id)}
                    tat={!monXem.conHang}
                  />
                </View>
              </View>
              <Pressable style={styles.nutDong} onPress={() => setMonXem(null)} hitSlop={10}>
                <X size={16} color="white" strokeWidth={3} />
              </Pressable>
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trangThaiGiua: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: MAU.nen, padding: 24 },
  textTai: { marginTop: 12, color: MAU.chuMo },
  textLoi: { color: MAU.nhan, textAlign: 'center', marginBottom: 16, fontSize: 14 },
  nutThuLai: { backgroundColor: MAU.nhan, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  textNutThuLai: { color: 'white', fontWeight: '700' },

  thanhBan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: MAU.vien,
  },
  textBan: { fontSize: 13.5, fontWeight: '700', color: MAU.chu },
  doiBan: { fontSize: 13, fontWeight: '700', color: MAU.nhan },

  thanChinh: { flex: 1, flexDirection: 'row' },

  // Sidebar
  sidebar: {
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: MAU.nenPhu,
    borderRightWidth: 1,
    borderRightColor: MAU.vien,
    paddingTop: 8,
  },
  tieuDeSidebar: { fontSize: 13, fontWeight: '800', color: MAU.chuMo, paddingHorizontal: 16, paddingVertical: 10, textTransform: 'uppercase' },
  oDanhMuc: { marginHorizontal: 8, marginBottom: 4, borderRadius: 10 },
  oDanhMucNgang: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 10, gap: 10 },
  oDanhMucDoc: { alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  oDanhMucDangChon: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: MAU.vien },
  textDanhMuc: { flex: 1, fontSize: 13.5, fontWeight: '600', color: MAU.chuMo },
  textDanhMucDangChon: { color: MAU.nhan, fontWeight: '800' },
  soMon: { fontSize: 11, color: MAU.chuMo, fontWeight: '600' },

  // Lưới
  noiDungLuoi: { padding: 16, paddingBottom: 110 },
  hangTieuDeLuoi: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  tieuDeLuoi: { fontSize: 20, fontWeight: '800', color: MAU.chu },
  hangLuoi: { flexDirection: 'row', gap: 14, marginBottom: 14 },

  theMon: {
    backgroundColor: MAU.nen,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: MAU.vien,
  },
  anhThe: { width: '100%', aspectRatio: 4 / 3, backgroundColor: MAU.nenPhu },
  noiDungThe: { padding: 12 },
  tenMon: { fontSize: 15, fontWeight: '800', color: MAU.chu },
  moTaMon: { fontSize: 12, color: MAU.chuMo, marginTop: 3, lineHeight: 16, minHeight: 32 },
  hangDuoiThe: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  giaMon: { fontSize: 15, fontWeight: '800', color: MAU.nhan },

  nutThem: {
    borderWidth: 1.5,
    borderColor: MAU.nhan,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textNutThem: { color: MAU.nhan, fontWeight: '800', fontSize: 13 },
  nutThemTat: { borderColor: MAU.vien, backgroundColor: MAU.nenPhu },
  nutStepperTat: { borderColor: '#C9C9CE', backgroundColor: '#C9C9CE' },
  nhanHetHang: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(26,26,26,0.85)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  textNhanHetHang: { color: 'white', fontSize: 12, fontWeight: '800' },
  textHetHangModal: { color: MAU.nhan, fontSize: 13, fontWeight: '700', marginTop: 8 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nutStepper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: MAU.vien,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutStepperDam: { borderColor: MAU.nhan, backgroundColor: MAU.nhan },
  soLuongStepper: { minWidth: 16, textAlign: 'center', fontWeight: '800', fontSize: 14, color: MAU.chu },

  // Thanh giỏ hàng
  thanhGioHang: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    backgroundColor: MAU.nhan,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  badgeSoLuong: {
    backgroundColor: 'white',
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  textBadge: { color: MAU.nhan, fontWeight: '800', fontSize: 13 },
  textThanhGioHangGia: { flex: 1, color: 'white', fontWeight: '800', fontSize: 18 },
  nutXemGio: { backgroundColor: 'white', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  textNutXemGio: { color: MAU.nhan, fontWeight: '800', fontSize: 14 },

  // Modal xem ảnh lớn
  nenModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  hopModal: { width: '100%', maxWidth: 520, backgroundColor: MAU.nen, borderRadius: 18, overflow: 'hidden' },
  anhModal: { width: '100%', aspectRatio: 4 / 3, backgroundColor: MAU.nenPhu },
  tenModal: { fontSize: 20, fontWeight: '800', color: MAU.chu },
  moTaModal: { fontSize: 14, color: MAU.chuMo, marginTop: 6, lineHeight: 20 },
  hangDuoiModal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  giaModal: { fontSize: 20, fontWeight: '800', color: MAU.nhan },
  nutDong: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nhomBan: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nhomPhai: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  nutGoi: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: MAU.nhan,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  nutGoiXong: { borderColor: '#1E9E5A', backgroundColor: '#E6F5EC' },
  textNutGoi: { fontSize: 12.5, fontWeight: '800', color: MAU.nhan },
});