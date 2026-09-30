import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { MonAn } from '../mon-an/mon-an.entity';

export enum TrangThaiDonHang {
  DANG_CHO = 'dang_cho',
  DANG_LAM = 'dang_lam',
  HOAN_THANH = 'hoan_thanh',
  DA_HUY = 'da_huy',
}

@Entity()
export class DonHang {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  soBan: string;

  @Column({ type: 'simple-enum', enum: TrangThaiDonHang, default: TrangThaiDonHang.DANG_CHO })
  trangThai: TrangThaiDonHang;

  @Column('float', { default: 0 })
  tongTien: number;

  @CreateDateColumn()
  thoiGianTao: Date;

  @OneToMany(() => ChiTietDonHang, (ct) => ct.donHang, { cascade: true })
  chiTiet: ChiTietDonHang[];
}

@Entity()
export class ChiTietDonHang {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DonHang, (dh) => dh.chiTiet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'donHangId' })
  donHang: DonHang;

  @Column()
  donHangId: number;

  @ManyToOne(() => MonAn, { eager: true })
  @JoinColumn({ name: 'monAnId' })
  monAn: MonAn;

  @Column()
  monAnId: number;

  @Column('int', { default: 1 })
  soLuong: number;

  @Column('float')
  donGia: number; // giá tại thời điểm đặt (phòng khi món đổi giá sau)

  @Column({ nullable: true })
  ghiChu: string;
}
