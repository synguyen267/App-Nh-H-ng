import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NhanVienGuard } from '../auth/nhan-vien.guard';
import { IsString } from 'class-validator';
import { writeFileSync } from 'fs';
import { join } from 'path';

class UploadAnhDto {
  @IsString()
  ten: string; // tên món, dùng để đặt tên file

  @IsString()
  duLieu: string; // ảnh dạng data:image/jpeg;base64,...
}

// Nhận ảnh từ trang admin, lưu vào public/images và trả về đường dẫn
@UseGuards(NhanVienGuard)
@Controller('api/upload')
export class UploadController {
  @Post()
  luu(@Body() dto: UploadAnhDto) {
    const kq = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(dto.duLieu);
    if (!kq) throw new BadRequestException('Chỉ nhận ảnh jpg, png hoặc webp');

    const buf = Buffer.from(kq[2], 'base64');
    if (buf.length > 5 * 1024 * 1024) throw new BadRequestException('Ảnh quá lớn (tối đa 5MB)');

    const duoi = kq[1] === 'jpeg' ? 'jpg' : kq[1];
    const slug =
      dto.ten
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/gi, 'd')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40) || 'mon';
    const tenFile = `${slug}-${Date.now()}.${duoi}`;

    writeFileSync(join(process.cwd(), 'public', 'images', tenFile), buf);
    return { hinhAnh: `/images/${tenFile}` };
  }
}