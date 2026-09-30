import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class TaoMonAnDto {
  @IsString()
  ten: string;

  @IsNumber()
  @Min(0)
  gia: number;

  @IsOptional()
  @IsString()
  moTa?: string;

  @IsOptional()
  @IsString()
  loai?: string;

  @IsOptional()
  @IsString()
  hinhAnh?: string;
}

export class CapNhatMonAnDto {
  @IsOptional()
  @IsString()
  ten?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gia?: number;

  @IsOptional()
  @IsString()
  moTa?: string;

  @IsOptional()
  @IsString()
  loai?: string;

  @IsOptional()
  @IsString()
  hinhAnh?: string;

  @IsOptional()
  @IsBoolean()
  conHang?: boolean;
}