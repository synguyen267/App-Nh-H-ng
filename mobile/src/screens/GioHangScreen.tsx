import React, { useState } from 'react';
import IconBan from '../components/IconBan';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useGioHang } from '../context/GioHangContext';
import { api } from '../api/client';
import AnhMon from '../components/AnhMon';
import { Plus, Minus, ShoppingCart } from 'lucide-react-native';
import { useBan } from '../context/BanContext';
import { thongBao } from '../utils/thongbao';

const MAU = {
  nen: '#FFFFFF',
  nenPhu: '#F5F5F5',
  chu: '#1A1A1A',
  chuMo: '#8E8E93',
  nhan: '#D0281E',
  vien: '#EDEDED',
};

export default function GioHangScreen({ navigation }: any) {
  const { cacMuc, themVaoGio, giamSoLuong, xoaKhoiGio, capNhatGhiChu, xoaTatCa, tongTien } = useGioHang();
  const { soBan } = useBan();
  const [dangDat, setDangDat] = useState(false);

  const datMon = async () => {
    if (cacMuc.length === 0) return;
    setDangDat(true);
    try {
      const danhSachMon = cacMuc.map((m) => ({
        monAnId: m.monAn.id,
        soLuong: m.soLuong,
        ghiChu: m.ghiChu?.trim() || undefined,
      }));
      const donHang = await api.taoDonHang(soBan || 'Chưa rõ bàn', danhSachMon);  // soBan lấy từ màn hình Chọn bàn
      xoaTatCa();
      navigation.replace('DatMonThanhCong', { donHang });
    } catch (e: any) {
      thongBao('Không đặt được món', e.message || 'Thử lại sau');
    } finally {
      setDangDat(false);
    }
  };

  if (cacMuc.length === 0) {
    return (
      <View style={styles.trongGiua}>
        <ShoppingCart size={56} color={MAU.chuMo} strokeWidth={1.5} style={{ marginBottom: 12 }} />
        <Text style={styles.textTrong}>Giỏ hàng đang trống</Text>
        <Pressable style={styles.nutQuayLai} onPress={() => navigation.goBack()}>
          <Text style={styles.textNutQuayLai}>Quay lại thực đơn</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cacMuc}
        keyExtractor={(item) => String(item.monAn.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View style={styles.oHienBan}>
            <IconBan size={20} />
            <Text style={styles.textHienBan}>{soBan || 'Chưa chọn bàn'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.dongMon}>
            <AnhMon mon={item.monAn} style={styles.anhMon} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.tenMon} numberOfLines={1}>{item.monAn.ten}</Text>
              <Text style={styles.giaMon}>{item.monAn.gia.toLocaleString('vi-VN')}đ</Text>
              <View style={styles.dieuKhien}>
                <Pressable style={styles.nutTron} onPress={() => giamSoLuong(item.monAn.id)}>
                  <Minus size={15} color={MAU.chu} strokeWidth={3} />
                </Pressable>
                <Text style={styles.soLuong}>{item.soLuong}</Text>
                <Pressable style={[styles.nutTron, styles.nutTronDam]} onPress={() => themVaoGio(item.monAn)}>
                  <Plus size={15} color="white" strokeWidth={3} />
                </Pressable>
                <Pressable onPress={() => xoaKhoiGio(item.monAn.id)} style={styles.nutXoa}>
                  <Text style={styles.textNutXoa}>Xóa</Text>
                </Pressable>
              </View>
              <TextInput
                style={styles.oGhiChu}
                value={item.ghiChu ?? ''}
                onChangeText={(t) => capNhatGhiChu(item.monAn.id, t)}
                placeholder="Ghi chú: ít cay, không hành..."
                placeholderTextColor={MAU.chuMo}
                maxLength={80}
              />
            </View>
          </View>
        )}
      />

      <View style={styles.chanTrang}>
        <View style={styles.hangTong}>
          <Text style={styles.textTong}>Tổng cộng</Text>
          <Text style={styles.giaTri}>{tongTien.toLocaleString('vi-VN')}đ</Text>
        </View>
        <Pressable style={styles.nutDatMon} onPress={datMon} disabled={dangDat}>
          {dangDat ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.textNutDatMon}>Đặt món ngay</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MAU.nen },
  trongGiua: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: MAU.nen, padding: 24 },
  textTrong: { fontSize: 16, color: MAU.chuMo, marginBottom: 16, fontWeight: '600' },
  nutQuayLai: { backgroundColor: MAU.nhan, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  textNutQuayLai: { color: 'white', fontWeight: '700' },
  oHienBan: {
    backgroundColor: MAU.nenPhu,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: MAU.vien,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textHienBan: { fontWeight: '700', color: MAU.chu, fontSize: 13.5 },
  dongMon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MAU.nen,
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: MAU.vien,
  },
  anhMon: { width: 64, height: 64, borderRadius: 10, backgroundColor: MAU.nenPhu, overflow: 'hidden' },
  tenMon: { fontSize: 15, fontWeight: '700', color: MAU.chu },
  giaMon: { fontSize: 13, color: MAU.nhan, fontWeight: '700', marginTop: 1, marginBottom: 6 },
  dieuKhien: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nutTron: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: MAU.vien,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutTronDam: { borderColor: MAU.nhan, backgroundColor: MAU.nhan },
  soLuong: { minWidth: 20, textAlign: 'center', fontWeight: '800', fontSize: 14, color: MAU.chu },
  oGhiChu: {
    marginTop: 8,
    backgroundColor: MAU.nenPhu,
    borderWidth: 1,
    borderColor: MAU.vien,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: MAU.chu,
  },
  nutXoa: { marginLeft: 'auto', paddingHorizontal: 4 },
  textNutXoa: { color: MAU.nhan, fontSize: 12, fontWeight: '700' },
  chanTrang: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: MAU.vien,
    backgroundColor: MAU.nen,
  },
  hangTong: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  textTong: { fontSize: 16, color: MAU.chuMo, fontWeight: '600' },
  giaTri: { fontSize: 22, fontWeight: '800', color: MAU.chu },
  nutDatMon: {
    backgroundColor: MAU.nhan,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  textNutDatMon: { color: 'white', fontWeight: '800', fontSize: 16 },
});