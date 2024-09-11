import { IsString } from 'class-validator';

export class UpdatePasswordUserDto {
  @IsString()
  new_password: string;

  @IsString()
  confirm_password: string;
}
