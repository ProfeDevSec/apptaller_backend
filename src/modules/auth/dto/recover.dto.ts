import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecoverDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'debe especificar una dirección de correo eletrónico',
  })
  @IsEmail(
    {},
    { message: 'debe especificar una dirección de correo eletrónico válida' },
  )
  readonly email: string;
}
