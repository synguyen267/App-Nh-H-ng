import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Svg, { Rect, Circle } from 'react-native-svg';
import { useBan } from '../context/BanContext';
import { ChefHat } from 'lucide-react-native';

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
const SO_LUONG_BAN = 12;
const SO_COT = 3; // luôn 3 ô to mỗi hàng
const DANH_SACH_BAN = Array.from({ length: SO_LUONG_BAN }, (_, i) => i + 1);

// Icon SVG: bàn tròn nhìn từ trên xuống, có 4 ghế
function IconBan({ size = 44, mauBan, mauGhe }: { size?: number; mauBan: string; mauGhe: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x={17} y={2} width={14} height={7} rx={3.5} fill={mauGhe} />
      <Rect x={17} y={39} width={14} height={7} rx={3.5} fill={mauGhe} />
      <Rect x={2} y={17} width={7} height={14} rx={3.5} fill={mauGhe} />
      <Rect x={39} y={17} width={7} height={14} rx={3.5} fill={mauGhe} />
      <Circle cx={24} cy={24} r={12} fill={mauBan} />
      <Circle cx={24} cy={24} r={6.5} fill="white" opacity={0.28} />
    </Svg>
  );
}

export default function ChonBanScreen({ navigation }: any) {
  const { chonBan } = useBan();

  // Tự chia hàng đúng 3 ô (không dựa vào flex-wrap) để canh đều
  const cacHang = useMemo(() => {
    const hang: number[][] = [];
    for (let i = 0; i < DANH_SACH_BAN.length; i += SO_COT) hang.push(DANH_SACH_BAN.slice(i, i + SO_COT));
    return hang;
  }, []);

  const chon = (so: number) => {
    chonBan(`Bàn ${so}`);
    navigation.replace('ThucDon');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.noiDung} showsVerticalScrollIndicator={false}>
        <View style={styles.khung}>
          <Text style={styles.chaoMung}>Chào mừng quý khách</Text>
          <Text style={styles.tieuDe}>Bạn đang ngồi ở bàn nào?</Text>
          <Text style={styles.phu}>Chạm vào số bàn để bắt đầu gọi món</Text>

          {cacHang.map((hang, idx) => (
            <View key={idx} style={styles.hang}>
              {hang.map((so) => (
                <Pressable
                  key={so}
                  onPress={() => chon(so)}
                  style={({ pressed }) => [styles.oBan, pressed && styles.oBanNhan]}
                >
                  {({ pressed }) => (
                    <>
                      <View style={[styles.vongIcon, pressed && styles.vongIconNhan]}>
                        <IconBan
                          size={44}
                          mauBan={pressed ? '#FFFFFF' : MAU.nhan}
                          mauGhe={pressed ? 'rgba(255,255,255,0.5)' : '#F1A29C'}
                        />
                      </View>
                      <Text style={[styles.tenBan, pressed && styles.chuTrang]}>Bàn {so}</Text>
                    </>
                  )}
                </Pressable>
              ))}
              {Array.from({ length: SO_COT - hang.length }).map((_, i) => (
                <View key={`trong-${i}`} style={{ flex: 1 }} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.chanTrang}>
        <Pressable style={styles.nutBep} onPress={() => navigation.navigate('Bep')}>
          <ChefHat size={16} color={MAU.chuMo} strokeWidth={2.2} />
          <Text style={styles.textNutBep}>Nhân viên · Vào màn hình bếp</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MAU.nen },
  noiDung: { flexGrow: 1, padding: 16, paddingTop: 28, alignItems: 'center' },
  khung: { width: '100%', maxWidth: 720 },

  chaoMung: { fontSize: 14, color: MAU.nhan, fontWeight: '700' },
  tieuDe: { fontSize: 24, fontWeight: '800', color: MAU.chu, marginTop: 4 },
  phu: { fontSize: 13, color: MAU.chuMo, marginTop: 4, marginBottom: 22, fontWeight: '600' },

  hang: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  oBan: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: MAU.nen,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: MAU.vien,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  oBanNhan: {
    backgroundColor: MAU.nhan,
    borderColor: MAU.nhan,
    shadowColor: MAU.nhan,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  vongIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: MAU.nhanNhat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vongIconNhan: { backgroundColor: 'rgba(255,255,255,0.18)' },
  tenBan: { fontSize: 16, fontWeight: '800', color: MAU.chu },
  chuTrang: { color: 'white' },

  chanTrang: { alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: MAU.vien, backgroundColor: MAU.nen },
  nutBep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: MAU.nenPhu,
    borderWidth: 1,
    borderColor: MAU.vien,
  },
  textNutBep: { color: MAU.chuMo, fontWeight: '700', fontSize: 13 },
});