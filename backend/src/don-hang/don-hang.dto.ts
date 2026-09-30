import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { TrangThaiDonHang } from './don-hang.entity';

export class MonTrongDonDto {
  @IsInt()
  monAnId: number;

  @IsInt()
  @Min(1)
  soLuong: number;

  @IsOptional()
  @IsString()
  ghiChu?: string;
}

export class TaoDonHangDto {
  @IsOptional()
  @IsString()
  soBan?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonTrongDonDto)
  danhSachMon: MonTrongDonDto[];
}

export class CapNhatTrangThaiDto {
  @IsEnum(TrangThaiDonHang)
  trangThai: TrangThaiDonHang;
}
