import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateCheckDto {
  @IsNumber()
  checkNumber: number;

  @IsString()
  payee: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  memo?: string;

  @IsDateString()
  date: string;

  @IsString()
  bankProfileId: string;

  @IsString()
  signerId: string;

  @IsString()
  ownerId: string;

  @IsOptional()
  @IsString()
  organizationId?: string;
}
