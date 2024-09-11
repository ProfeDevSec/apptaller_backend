import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UpdatePersonUserDto {
  @IsString()
  @IsEmail({}, { message: 'Debe especificar un email válido' })
  email: string;

  @IsString()
  nombres: string;

  @IsString()
  apellido_paterno: string;
}
