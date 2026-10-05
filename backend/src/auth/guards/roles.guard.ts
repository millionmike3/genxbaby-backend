import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private requiredRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('Missing roles');
    }

    const hasRole = user.roles.some((role: string) =>
      this.requiredRoles.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
