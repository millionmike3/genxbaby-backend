import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class UpdateCheckDto {
  @IsOptional()
  @IsString()
  payee?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  memo?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  organizationId?: string;
}
