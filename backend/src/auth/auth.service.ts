import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(ownerId: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        ownerId,
        email,
        password: hashed,
      },
      include: {
        roles: { include: { role: true } },
        permissions: { include: { permission: true } },
      },
    });

    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: { include: { role: true } },
        permissions: { include: { permission: true } },
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  generateToken(user: any) {
    const roles = user.roles.map(r => r.role.name);
    const permissions = user.permissions.map(p => p.permission.key);

    const payload = {
      sub: user.id,
      ownerId: user.ownerId,
      email: user.email,
      roles,
      permissions,
    };

    return {
      accessToken: this.jwt.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        ownerId: user.ownerId,
        roles,
        permissions,
      },
    };
  }
}
