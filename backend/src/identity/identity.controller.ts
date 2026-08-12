import { Controller, Get, Param } from '@nestjs/common';
import { IdentityResolutionService } from './identity-resolution.service';

@Controller('owners')
export class IdentityController {
  constructor(private identity: IdentityResolutionService) {}

  @Get(':id/identity')
  async resolve(@Param('id') id: string) {
    return this.identity.resolveOwnerIdentity(id);
  }
}
