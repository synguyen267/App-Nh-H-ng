import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Lock } from 'lucide-react-native';
import { api } from '../api/client';

const MAU = { nen: '#FFFFFF', nenPhu: '#F6F6F7', chu: '#1A1A1A', chuMo: '#8E8E93', nhan: '#D0281E', nhanNhat: '#FDECEA', vien: '#EAEAEA' };

export default function PinPad({ tieuDe, onThanhCong }: { tieuDe: string; onThanhCong: () => void }) {
  const [pin, setPin] = useState('');
  const [loi, setLoi] = useState('');
  const [dang, setDang] = useState(false);

  const vao = async () => {
    if (!pin || dang) return;
    setDang(true);
    setLoi('');
    try {
      await api.dangNhapNhanVien(pin);
      onThanhCong();
    } catch (e: any) {
      setLoi(e.message || 'Sai mã PIN');
      setPin('');
    } finally {
      setDang(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.vong}>
        <Lock size={28} color={MAU.nhan} strokeWidth={2.2} />
      </View>
      <Text style={styles.tieuDe}>{tieuDe}</Text>
      <Text style={styles.phu}>Nhập mã PIN nhân viên để tiếp tục</Text>
      <TextInput
        style={styles.oPin}
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="number-pad"
        maxLength={8}
        autoFocus
        onSubmitEditing={vao}
        placeholder="••••"
        placeholderTextColor={MAU.vien}
      />
      {!!loi && <Text style={styles.loi}>{loi}</Text>}
      <Pressable style={[styles.nut, !pin && { backgroundColor: '#C9C9CE' }]} onPress={vao} disabled={!pin || dang}>
        {dang ? <ActivityIndicator color="white" /> : <Text style={styles.textNut}>Vào</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MAU.nen, alignItems: 'center', justifyContent: 'center', padding: 24 },
  vong: { width: 64, height: 64, borderRadius: 32, backgroundColor: MAU.nhanNhat, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  tieuDe: { fontSize: 22, fontWeight: '800', color: MAU.chu },
  phu: { fontSize: 13, color: MAU.chuMo, marginTop: 4, marginBottom: 22, fontWeight: '600' },
  oPin: {
    width: 220,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 8,
    color: MAU.chu,
    backgroundColor: MAU.nenPhu,
    borderWidth: 1.5,
    borderColor: MAU.vien,
    borderRadius: 14,
    paddingVertical: 12,
  },
  loi: { color: MAU.nhan, fontWeight: '700', fontSize: 13, marginTop: 10 },
  nut: { marginTop: 16, width: 220, backgroundColor: MAU.nhan, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  textNut: { color: 'white', fontWeight: '800', fontSize: 15 },
});