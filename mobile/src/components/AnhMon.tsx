import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { MonAn, layUrlAnh } from '../api/client';
import { IconLoai, layThongTinLoai } from './IconLoai';

// Ảnh món ăn. Nếu chưa có ảnh (hoặc tải lỗi) thì hiện ô màu + icon SVG theo danh mục.
export default function AnhMon({
  mon,
  style,
  coLon,
}: {
  mon: MonAn;
  style: any;
  coLon?: boolean;
}) {
  const [loi, setLoi] = useState(false);
  const url = layUrlAnh(mon.hinhAnh);

  if (!url || loi) {
    const { nen } = layThongTinLoai(mon.loai);
    return (
      <View style={[style, { backgroundColor: nen, alignItems: 'center', justifyContent: 'center' }]}>
        <IconLoai loai={mon.loai} size={coLon ? 72 : 44} strokeWidth={1.5} />
      </View>
    );
  }
  return <Image source={{ uri: url }} style={style} resizeMode="cover" onError={() => setLoi(true)} />;
}