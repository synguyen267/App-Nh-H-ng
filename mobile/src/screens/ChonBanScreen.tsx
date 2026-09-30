import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Check, ShoppingBag, UtensilsCrossed } from 'lucide-react-native';

const MAU = {
  nen: '#FFFFFF',
  nenPhu: '#F6F6F7',
  chu: '#1A1A1A',
  chuMo: '#8E8E93',
  nhan: '#D0281E',
  nhanNhat: '#FDECEA',
  vien: '#EAEAEA',
};

// Đổi số lượng bàn của quán tại đây
export const SO_LUONG_BAN = 12;
export const MANG_VE = 'Mang về';

// Chọn bàn dạng lưới: bấm 1 ô là chọn, giá trị trả về là chuỗi "Bàn 5" hoặc "Mang về"
export default function ChonBan({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { width } = useWindowDimensions();
  const soCot = width >= 700 ? 6 : 4;

  const cacHang = useMemo(() => {
    const ds = Array.from({ length: SO_LUONG_BAN }, (_, i) => i + 1);
    const hang: number[][] = [];
    for (let i = 0; i < ds.length; i += soCot) hang.push(ds.slice(i, i + soCot));
    return hang;
  }, [soCot]);

  const laMangVe = value === MANG_VE;

  return (
    <View style={styles.the}>
      <View style={styles.tieuDe}>
        <View style={styles.iconTron}>
          <UtensilsCrossed size={18} color={MAU.nhan} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.tenTieuDe}>Chọn bàn của bạn</Text>
          <Text style={styles.phuTieuDe}>Số bàn có trên mặt bàn hoặc hỏi nhân viên</Text>
        </View>
        {!!value && (
          <View style={styles.daChon}>
            <Text style={styles.textDaChon}>{value}</Text>
          </View>
        )}
      </View>

      {cacHang.map((hang, idx) => (
        <View key={idx} style={styles.hang}>
          {hang.map((so) => {
            const ten = `Bàn ${so}`;
            const chon = value === ten;
            return (
              <Pressable
                key={so}
                onPress={() => onChange(ten)}
                style={({ pressed }) => [
                  styles.oBan,
                  chon && styles.oBanChon,
                  pressed && !chon && styles.oBanNhan,
                ]}
              >
                <Text style={[styles.chuBan, chon && styles.chuBanChon]}>Bàn</Text>
                <Text style={[styles.soBan, chon && styles.soBanChon]}>{so}</Text>
                {chon && (
                  <View style={styles.dauCheck}>
                    <Check size={11} color={MAU.nhan} strokeWidth={4} />
                  </View>
                )}
              </Pressable>
            );
          })}
          {Array.from({ length: soCot - hang.length }).map((_, i) => (
            <View key={`trong-${i}`} style={{ flex: 1 }} />
          ))}
        </View>
      ))}

      <Pressable
        onPress={() => onChange(MANG_VE)}
        style={[styles.nutMangVe, laMangVe && styles.nutMangVeChon]}
      >
        <ShoppingBag size={18} color={laMangVe ? 'white' : MAU.chu} strokeWidth={2.2} />
        <Text style={[styles.textMangVe, laMangVe && { color: 'white' }]}>Mang về</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  the: {
    backgroundColor: MAU.nenPhu,
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: MAU.vien,
  },
  tieuDe: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  iconTron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MAU.nhanNhat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tenTieuDe: { fontSize: 16, fontWeight: '800', color: MAU.chu },
  phuTieuDe: { fontSize: 12, color: MAU.chuMo, marginTop: 1 },
  daChon: { backgroundColor: MAU.nhan, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  textDaChon: { color: 'white', fontWeight: '800', fontSize: 12 },

  hang: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  oBan: {
    flex: 1,
    aspectRatio: 1.1,
    backgroundColor: MAU.nen,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: MAU.vien,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oBanNhan: { backgroundColor: MAU.nhanNhat, borderColor: '#F3B6B1' },
  oBanChon: {
    backgroundColor: MAU.nhan,
    borderColor: MAU.nhan,
    shadowColor: MAU.nhan,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  chuBan: { fontSize: 11, fontWeight: '700', color: MAU.chuMo },
  chuBanChon: { color: 'rgba(255,255,255,0.8)' },
  soBan: { fontSize: 22, fontWeight: '800', color: MAU.chu, marginTop: -1 },
  soBanChon: { color: 'white' },
  dauCheck: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nutMangVe: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: MAU.nen,
    borderWidth: 1.5,
    borderColor: MAU.vien,
    borderStyle: 'dashed',
  },
  nutMangVeChon: { backgroundColor: MAU.chu, borderColor: MAU.chu, borderStyle: 'solid' },
  textMangVe: { fontSize: 14, fontWeight: '800', color: MAU.chu },
});