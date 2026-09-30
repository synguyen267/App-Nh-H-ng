import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Ảnh món ăn: backend/public/images -> http://localhost:4000/images/ten-anh.jpg
  const thuMucAnh = join(process.cwd(), 'public', 'images');
  mkdirSync(thuMucAnh, { recursive: true });
  app.useStaticAssets(thuMucAnh, { prefix: '/images' });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend đang chạy tại http://localhost:${port}`);
}
bootstrap();