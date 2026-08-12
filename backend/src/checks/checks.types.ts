export interface CheckCreateDto {
  amount: number;
  bankProfileId: string;
  signerId: string;
}

export interface FraudFlagDto {
  type: string;
}
