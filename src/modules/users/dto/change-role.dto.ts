import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChangeRoleDto {
  @IsNotEmpty({ message: 'Debe especificar un usuario' })
  @IsString()
  readonly userNid: string;

  @IsNotEmpty({ message: 'Debe especificar un rol' })
  @IsString()
  readonly rolNid: string;

  @IsBoolean()
  readonly checked: boolean;
}
