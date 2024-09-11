import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// VULN falta definir politica de contraseña y validar según esa

export class ChangePwdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly new_password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly retype_password: string;
}
