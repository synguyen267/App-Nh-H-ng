import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

const MAU = {
  nen: '#FFFFFF',
  nenPhu: '#F5F5F5',
  chu: '#1A1A1A',
  chuMo: '#8E8E93',
  nhan: '#D0281E',
  xanh: '#1E9E5A',
  vien: '#EDEDED',
};

export default function DatMonThanhCongScreen({ route, navigation }: any) {
  const { donHang } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
        <View style={styles.vongTron}>
          <Text style={styles.dauCheck}>✓</Text>
        </View>
        <Text style={styles.tieuDe}>Đặt món thành công!</Text>
        <Text style={styles.phu}>Mã đơn #{donHang.id} · {donHang.soBan}</Text>

        <View style={styles.the}>
          {donHang.chiTiet.map((ct: any) => (
            <View key={ct.id} style={styles.dong}>
              <Text style={styles.tenMon}>{ct.soLuong}× {ct.monAn.ten}</Text>
              <Text style={styles.gia}>{(ct.donGia * ct.soLuong).toLocaleString('vi-VN')}đ</Text>
            </View>
          ))}
          <View style={styles.duong} />
          <View style={styles.dong}>
            <Text style={styles.tongChu}>Tổng cộng</Text>
            <Text style={styles.tongGia}>{donHang.tongTien.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        <Pressable
          style={styles.nut}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'ThucDon' }] })}
        >
          <Text style={styles.textNut}>Về thực đơn</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MAU.nen },
  vongTron: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: MAU.xanh,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  dauCheck: { color: 'white', fontSize: 38, fontWeight: '800' },
  tieuDe: { fontSize: 23, fontWeight: '800', color: MAU.chu },
  phu: { color: MAU.chuMo, marginTop: 4, marginBottom: 24, fontWeight: '600' },
  the: {
    width: '100%',
    backgroundColor: MAU.nenPhu,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: MAU.vien,
  },
  dong: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  tenMon: { color: MAU.chu, fontSize: 14 },
  gia: { color: MAU.chu, fontSize: 14, fontWeight: '700' },
  duong: { height: 1, backgroundColor: MAU.vien, marginVertical: 8 },
  tongChu: { fontWeight: '800', fontSize: 15, color: MAU.chu },
  tongGia: { fontWeight: '800', fontSize: 18, color: MAU.nhan },
  nut: {
    marginTop: 28,
    backgroundColor: MAU.nhan,
    paddingHorizontal: 32,
    paddingVertical: 15,
    borderRadius: 12,
  },
  textNut: { color: 'white', fontWeight: '800', fontSize: 15 },
});