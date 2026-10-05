import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Extract roles from UserRole join table
    const roles = user.roles.map((r) => r.role.name.toLowerCase());

    // Determine cookieName based on primary role
    const primaryRole = roles[0];

    const cookieName = `${primaryRole}_token`;

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        roles,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return {
      token,
      cookieName,
      role: primaryRole,
      roles,
    };
  }
}
