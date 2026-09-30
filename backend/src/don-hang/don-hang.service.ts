import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DonHang } from './don-hang.entity';
import { ChiTietDonHang } from './don-hang.entity';
import { MonAn } from '../mon-an/mon-an.entity';
import { TaoDonHangDto, CapNhatTrangThaiDto } from './don-hang.dto';

@Injectable()
export class DonHangService {
  constructor(
    @InjectRepository(DonHang) private donHangRepo: Repository<DonHang>,
    @InjectRepository(ChiTietDonHang) private chiTietRepo: Repository<ChiTietDonHang>,
    @InjectRepository(MonAn) private monAnRepo: Repository<MonAn>,
  ) {}

  timTatCa() {
    return this.donHangRepo.find({
      relations: { chiTiet: { monAn: true } },
      order: { id: 'DESC' },
    });
  }

  async timMotCai(id: number) {
    const donHang = await this.donHangRepo.findOne({
      where: { id },
      relations: { chiTiet: { monAn: true } },
    });
    if (!donHang) throw new NotFoundException(`Không tìm thấy đơn hàng #${id}`);
    return donHang;
  }

  async tao(dto: TaoDonHangDto) {
    if (!dto.danhSachMon || dto.danhSachMon.length === 0) {
      throw new BadRequestException('Đơn hàng phải có ít nhất 1 món');
    }

    const monIds = dto.danhSachMon.map((m) => m.monAnId);
    const dsMonAn = await this.monAnRepo.findBy({ id: In(monIds) });
    const mapMonAn = new Map(dsMonAn.map((m) => [m.id, m]));

    let tongTien = 0;
    const chiTiet: ChiTietDonHang[] = [];

    for (const item of dto.danhSachMon) {
      const monAn = mapMonAn.get(item.monAnId);
      if (!monAn) {
        throw new BadRequestException(`Món ăn #${item.monAnId} không tồn tại`);
      }
      const ct = this.chiTietRepo.create({
        monAnId: monAn.id,
        soLuong: item.soLuong,
        donGia: monAn.gia,
        ghiChu: item.ghiChu,
      });
      tongTien += monAn.gia * item.soLuong;
      chiTiet.push(ct);
    }

    const donHang = this.donHangRepo.create({
      soBan: dto.soBan,
      tongTien,
      chiTiet,
    });

    const daLuu = await this.donHangRepo.save(donHang);
    return this.timMotCai(daLuu.id);
  }

  async capNhatTrangThai(id: number, dto: CapNhatTrangThaiDto) {
    const donHang = await this.timMotCai(id);
    donHang.trangThai = dto.trangThai;
    await this.donHangRepo.save(donHang);
    return this.timMotCai(id);
  }

  async xoa(id: number) {
    const donHang = await this.timMotCai(id);
    await this.donHangRepo.remove(donHang);
    return { thanhCong: true };
  }
}
