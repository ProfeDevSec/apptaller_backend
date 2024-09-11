import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RolesUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Debe especificar un rol' })
  @IsArray()
  readonly roles: Array<string>;

  @ApiProperty()
  @IsNotEmpty({ message: 'Debe especificar un usuario' })
  @IsUUID()
  readonly user_nid: string;
}
