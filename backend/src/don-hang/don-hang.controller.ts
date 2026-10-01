import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { NhanVienGuard } from '../auth/nhan-vien.guard';
import { DonHangService } from './don-hang.service';
import { TaoDonHangDto, CapNhatTrangThaiDto } from './don-hang.dto';

@Controller('api/donhang')
export class DonHangController {
  constructor(private readonly service: DonHangService) {}

  @UseGuards(NhanVienGuard)
  @Get()
  timTatCa() {
    return this.service.timTatCa();
  }

  @UseGuards(NhanVienGuard)
  @Get(':id')
  timMotCai(@Param('id', ParseIntPipe) id: number) {
    return this.service.timMotCai(id);
  }

  @Post()
  tao(@Body() dto: TaoDonHangDto) {
    return this.service.tao(dto);
  }

  @UseGuards(NhanVienGuard)
  @Put(':id/trangthai')
  capNhatTrangThai(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CapNhatTrangThaiDto,
  ) {
    return this.service.capNhatTrangThai(id, dto);
  }

  @UseGuards(NhanVienGuard)
  @Delete(':id')
  xoa(@Param('id', ParseIntPipe) id: number) {
    return this.service.xoa(id);
  }
}