import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonAn } from './mon-an.entity';
import { MonAnService } from './mon-an.service';
import { MonAnController } from './mon-an.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MonAn])],
  controllers: [MonAnController],
  providers: [MonAnService],
  exports: [MonAnService],
})
export class MonAnModule {}
