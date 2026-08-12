import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private requiredPermissions: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException('Missing permissions');
    }

    const hasPermission = user.permissions.some((perm: string) =>
      this.requiredPermissions.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permission');
    }

    return true;
  }
}
