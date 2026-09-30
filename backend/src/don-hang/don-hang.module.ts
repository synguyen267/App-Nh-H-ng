import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonHang, ChiTietDonHang } from './don-hang.entity';
import { MonAn } from '../mon-an/mon-an.entity';
import { DonHangService } from './don-hang.service';
import { DonHangController } from './don-hang.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DonHang, ChiTietDonHang, MonAn])],
  controllers: [DonHangController],
  providers: [DonHangService],
})
export class DonHangModule {}
