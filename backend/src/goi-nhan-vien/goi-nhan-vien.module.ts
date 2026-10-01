import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NhanVienGuard } from '../auth/nhan-vien.guard';
import { IsString } from 'class-validator';

export interface LuotGoi {
  id: number;
  soBan: string;
  thoiGian: string;
}

class GoiNhanVienDto {
  @IsString()
  soBan: string;
}

// Lượt gọi nhân viên chỉ cần giữ tạm trong bộ nhớ: xử lý xong là xóa
@Injectable()
export class GoiNhanVienService {
  private ds: LuotGoi[] = [];
  private demId = 1;

  tao(soBan: string) {
    const daCo = this.ds.find((g) => g.soBan === soBan); // bàn đang chờ rồi thì không tạo thêm
    if (daCo) return daCo;
    const luot = { id: this.demId++, soBan, thoiGian: new Date().toISOString() };
    this.ds.push(luot);
    return luot;
  }

  timTatCa() {
    return this.ds;
  }

  xuLy(id: number) {
    const i = this.ds.findIndex((g) => g.id === id);
    if (i < 0) throw new NotFoundException(`Không tìm thấy lượt gọi #${id}`);
    this.ds.splice(i, 1);
    return { thanhCong: true };
  }
}

@Controller('api/goinhanvien')
export class GoiNhanVienController {
  constructor(private readonly service: GoiNhanVienService) {}

  @UseGuards(NhanVienGuard)
  @Get()
  timTatCa() {
    return this.service.timTatCa();
  }

  @Post()
  tao(@Body() dto: GoiNhanVienDto) {
    return this.service.tao(dto.soBan);
  }

  @UseGuards(NhanVienGuard)
  @Delete(':id')
  xuLy(@Param('id', ParseIntPipe) id: number) {
    return this.service.xuLy(id);
  }
}

@Module({
  controllers: [GoiNhanVienController],
  providers: [GoiNhanVienService],
})
export class GoiNhanVienModule {}