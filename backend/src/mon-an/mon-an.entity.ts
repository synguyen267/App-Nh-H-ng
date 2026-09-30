import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MonAn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ten: string;

  @Column('float')
  gia: number;

  @Column({ nullable: true })
  moTa: string;

  @Column({ default: 'Khác' })
  loai: string; // Khai vị, Món chính, Tráng miệng, Nước uống...

  @Column({ nullable: true })
  hinhAnh: string;

  @Column({ default: true })
  conHang: boolean;
}