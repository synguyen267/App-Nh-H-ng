import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

// Đổi mã PIN bằng biến môi trường PIN_NHAN_VIEN (mặc định 1234)
export const layPin = () => process.env.PIN_NHAN_VIEN || '1234';

// Chặn các API dành cho nhân viên: client phải gửi header x-pin đúng
@Injectable()
export class NhanVienGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    if (req.headers['x-pin'] !== layPin()) throw new UnauthorizedException('Sai mã PIN');
    return true;
  }
}