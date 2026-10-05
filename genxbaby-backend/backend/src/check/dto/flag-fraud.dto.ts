import { IsString } from 'class-validator';

export class FlagFraudDto {
  @IsString()
  type: string;

  @IsString()
  severity: string;

  @IsString()
  message: string;

  @IsString()
  checkId: string;

  @IsString()
  organizationId: string;
}
