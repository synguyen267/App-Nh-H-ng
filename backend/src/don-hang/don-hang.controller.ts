import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { DonHangService } from './don-hang.service';
import { TaoDonHangDto, CapNhatTrangThaiDto } from './don-hang.dto';

@Controller('api/donhang')
export class DonHangController {
  constructor(private readonly service: DonHangService) {}

  @Get()
  timTatCa() {
    return this.service.timTatCa();
  }

  @Get(':id')
  timMotCai(@Param('id', ParseIntPipe) id: number) {
    return this.service.timMotCai(id);
  }

  @Post()
  tao(@Body() dto: TaoDonHangDto) {
    return this.service.tao(dto);
  }

  @Put(':id/trangthai')
  capNhatTrangThai(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CapNhatTrangThaiDto,
  ) {
    return this.service.capNhatTrangThai(id, dto);
  }

  @Delete(':id')
  xoa(@Param('id', ParseIntPipe) id: number) {
    return this.service.xoa(id);
  }
}
