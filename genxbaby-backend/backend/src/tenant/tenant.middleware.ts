import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req, res, next) {
    const orgId =
      req.headers['x-org-id'] ||
      req.user?.organizationId ||
      req.session?.organizationId;

    if (!orgId) {
      throw new Error('Missing organization context (x-org-id)');
    }

    req.organizationId = orgId;
    next();
  }
}
