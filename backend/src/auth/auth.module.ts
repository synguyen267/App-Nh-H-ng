import { Body, Controller, HttpException, Module, Post, Req, UnauthorizedException } from '@nestjs/common';
import { IsString } from 'class-validator';
import { layPin } from './nhan-vien.guard';

class DangNhapDto {
  @IsString()
  pin: string;
}

@Controller('api/auth')
export class AuthController {
  private sai = new Map<string, { dem: number; den: number }>();

  @Post('dangnhap')
  dangNhap(@Body() dto: DangNhapDto, @Req() req: any) {
    const ip = req.ip;
    const t = this.sai.get(ip);
    if (t && t.dem >= 5 && Date.now() < t.den) {
      throw new HttpException('Nhập sai quá nhiều lần, thử lại sau 1 phút', 429);
    }
    if (dto.pin !== layPin()) {
      this.sai.set(ip, { dem: (t?.dem ?? 0) + 1, den: Date.now() + 60000 });
      throw new UnauthorizedException('Sai mã PIN');
    }
    this.sai.delete(ip);
    return { thanhCong: true };
  }
}

@Module({ controllers: [AuthController] })
export class AuthModule {}