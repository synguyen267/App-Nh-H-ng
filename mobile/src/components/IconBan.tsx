import React from 'react';
import Svg, { Rect, Circle } from 'react-native-svg';

// Icon SVG: bàn tròn nhìn từ trên xuống, có 4 ghế
export default function IconBan({
  size = 20,
  mauBan = '#D0281E',
  mauGhe = '#F1A29C',
}: {
  size?: number;
  mauBan?: string;
  mauGhe?: string;
}) {
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