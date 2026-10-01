import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonAnModule } from './mon-an/mon-an.module';
import { DonHangModule } from './don-hang/don-hang.module';
import { GoiNhanVienModule } from './goi-nhan-vien/goi-nhan-vien.module';
import { MonAn } from './mon-an/mon-an.entity';
import { DonHang, ChiTietDonHang } from './don-hang/don-hang.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'nha-hang.sqlite',
      entities: [MonAn, DonHang, ChiTietDonHang],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([MonAn]),
    MonAnModule,
    DonHangModule,
    GoiNhanVienModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectRepository(MonAn) private monAnRepo: Repository<MonAn>,
  ) {}

  async onModuleInit() {
    // Dữ liệu mẫu. Ảnh nằm ở backend/public/images/<tên file>
    const monMau = [
      { ten: 'Phở bò tái', gia: 55000, loai: 'Món chính', moTa: 'Phở bò truyền thống, nước dùng ninh xương 8 tiếng', hinhAnh: '/images/pho-bo-tai.jpg' },
      { ten: 'Bún chả', gia: 50000, loai: 'Món chính', moTa: 'Bún chả Hà Nội, thịt nướng than hoa', hinhAnh: '/images/bun-cha.jpg' },
      { ten: 'Gỏi cuốn tôm thịt', gia: 35000, loai: 'Khai vị', moTa: '3 cuốn/phần, chấm tương đậu phộng', hinhAnh: '/images/goi-cuon.jpg' },
      { ten: 'Chả giò', gia: 40000, loai: 'Khai vị', moTa: 'Chả giò chiên giòn, 6 cuốn/phần', hinhAnh: '/images/cha-gio.jpg' },
      { ten: 'Cơm tấm sườn bì', gia: 45000, loai: 'Món chính', moTa: 'Sườn nướng, bì, chả trứng', hinhAnh: '/images/com-tam.jpg' },
      { ten: 'Canh chua cá lóc', gia: 60000, loai: 'Món chính', moTa: 'Canh chua kiểu Nam Bộ', hinhAnh: '/images/canh-chua.jpg' },
      { ten: 'Chè ba màu', gia: 20000, loai: 'Tráng miệng', moTa: 'Đậu xanh, đậu đỏ, thạch, nước cốt dừa', hinhAnh: '/images/che-ba-mau.jpg' },
      { ten: 'Bánh flan', gia: 15000, loai: 'Tráng miệng', moTa: 'Caramen mềm mịn', hinhAnh: '/images/banh-flan.jpg' },
      { ten: 'Trà đào cam sả', gia: 25000, loai: 'Nước uống', moTa: 'Đào miếng, cam tươi, sả', hinhAnh: '/images/tra-dao.jpg' },
      { ten: 'Nước cam ép', gia: 25000, loai: 'Nước uống', moTa: 'Cam tươi 100%, không đường', hinhAnh: '/images/nuoc-cam.jpg' },
      { ten: 'Cà phê sữa đá', gia: 20000, loai: 'Nước uống', moTa: 'Cà phê phin truyền thống', hinhAnh: '/images/ca-phe-sua-da.jpg' },
      { ten: 'Bia Sài Gòn', gia: 20000, loai: 'Nước uống', moTa: 'Lon 330ml', hinhAnh: '/images/bia-sai-gon.jpg' },
    ];

    for (const mon of monMau) {
      const daCo = await this.monAnRepo.findOneBy({ ten: mon.ten });
      if (!daCo) {
        await this.monAnRepo.save(mon); // chưa có -> thêm mới
      } else if (!daCo.hinhAnh || !daCo.hinhAnh.startsWith('/images/')) {
        // món cũ đang dùng link ảnh ngoài (bị lỗi) -> chuyển sang ảnh nội bộ
        daCo.hinhAnh = mon.hinhAnh;
        await this.monAnRepo.save(daCo);
      }
    }
  }
}