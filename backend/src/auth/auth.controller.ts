import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: { email: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, user } = await this.auth.login(dto.email, dto.password);

    // Determine cookie name based on role
    const primaryRole = user.roles[0]; // borrower, owner, investor, admin, lo, uw
    const cookieName = `${primaryRole}_token`;

    // Set cookie
    res.cookie(cookieName, accessToken, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return { user };
  }

  @Post('register')
  async register(
    @Body() dto: { ownerId: string; email: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, user } = await this.auth.register(
      dto.ownerId,
      dto.email,
      dto.password
    );

    const primaryRole = user.roles[0];
    const cookieName = `${primaryRole}_token`;

    res.cookie(cookieName, accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { user };
  }
}
