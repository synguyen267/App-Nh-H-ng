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
import { MonAnService } from './mon-an.service';
import { TaoMonAnDto, CapNhatMonAnDto } from './mon-an.dto';

@Controller('api/monan')
export class MonAnController {
  constructor(private readonly service: MonAnService) {}

  @Get()
  timTatCa() {
    return this.service.timTatCa();
  }

  @Get(':id')
  timMotCai(@Param('id', ParseIntPipe) id: number) {
    return this.service.timMotCai(id);
  }

  @UseGuards(NhanVienGuard)
  @Post()
  tao(@Body() dto: TaoMonAnDto) {
    return this.service.tao(dto);
  }

  @UseGuards(NhanVienGuard)
  @Put(':id')
  capNhat(@Param('id', ParseIntPipe) id: number, @Body() dto: CapNhatMonAnDto) {
    return this.service.capNhat(id, dto);
  }

  @UseGuards(NhanVienGuard)
  @Delete(':id')
  xoa(@Param('id', ParseIntPipe) id: number) {
    return this.service.xoa(id);
  }
}