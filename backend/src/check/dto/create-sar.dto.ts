import { IsString } from 'class-validator';

export class CreateSarDto {
  @IsString()
  flagId: string;

  @IsString()
  checkId: string;

  @IsString()
  severity: string;

  @Is