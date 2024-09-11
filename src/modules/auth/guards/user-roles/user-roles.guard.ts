import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { Roles } from '../../../../models/entities/Roles';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../../../models/entities/Users';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(
    @InjectRepository(Users)
    private rolesRepository: Repository<Roles>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new NotFoundException('User not found!!');

    const rolesUser = await this.rolesRepository.find({
      select: ['id', 'codigo', 'descripcion'],
      where: {
        userRoles: {
          user: {
            id: user.id,
          },
        },
      },
    });

    let flag: boolean = false;

    //rolesUser.forEach((rol: any) => {
    // if ( !rolesQuery.includes( roles ) ) throw new UnauthorizedException('User Role is not valid');
    // if (roles.includes(rol.codigo)) {
    // VULN Autorización insuficiente
    flag = true;
    // }
    //});

    if (!flag) throw new UnauthorizedException('User Role is not valid');

    return true;
  }
}
