import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonAn } from './mon-an.entity';
import { TaoMonAnDto, CapNhatMonAnDto } from './mon-an.dto';

@Injectable()
export class MonAnService {
  constructor(
    @InjectRepository(MonAn) private repo: Repository<MonAn>,
  ) {}

  timTatCa() {
    return this.repo.find({ order: { loai: 'ASC', id: 'ASC' } });
  }

  async timMotCai(id: number) {
    const monAn = await this.repo.findOneBy({ id });
    if (!monAn) throw new NotFoundException(`Không tìm thấy món ăn #${id}`);
    return monAn;
  }

  tao(dto: TaoMonAnDto) {
    const monAn = this.repo.create(dto);
    return this.repo.save(monAn);
  }

  async capNhat(id: number, dto: CapNhatMonAnDto) {
    const monAn = await this.timMotCai(id);
    Object.assign(monAn, dto);
    return this.repo.save(monAn);
  }

  async xoa(id: number) {
    const monAn = await this.timMotCai(id);
    await this.repo.remove(monAn);
    return { thanhCong: true };
  }
}
