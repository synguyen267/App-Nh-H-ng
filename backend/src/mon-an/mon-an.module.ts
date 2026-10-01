import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonAn } from './mon-an.entity';
import { MonAnService } from './mon-an.service';
import { MonAnController } from './mon-an.controller';
import { UploadController } from './upload.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MonAn])],
  controllers: [MonAnController, UploadController],
  providers: [MonAnService],
  exports: [MonAnService],
})
export class MonAnModule {}