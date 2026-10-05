export class CreateUserDto {
  ownerId: string;
  email: string;
  name?: string;
  password: string;
}
