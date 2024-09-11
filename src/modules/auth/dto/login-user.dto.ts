import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'debe especificar un username' })
  @IsEmail(
    {},
    { message: 'username debe ser un dirección de correo eletrónico válida' },
  )
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'debe especificar un password' })
  @IsString({
    message: 'Contraseña contiene caracteres no permitidos',
  })
  readonly password: string;
}
