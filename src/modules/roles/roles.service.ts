import {
  // ExecutionContext,
  Injectable,
  ForbiddenException,
  // NotFoundException,
} from '@nestjs/common';
import { RolesUserDto } from './dto/roles-user.dto';
import { Roles } from '../../models/entities/Roles';
import { Users } from '../../models/entities/Users';
import { UserRoles } from '../../models/entities/UserRoles';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    @InjectRepository(UserRoles)
    private userrolesRepository: Repository<UserRoles>,
  ) {}

  async findAll(user: any) {
    const roles = await this.rolesRepository.find({
      select: {
        nid: true,
        codigo: true,
        descripcion: true,
      },
    });
    // if (!users) throw new NotFoundException('');
    return roles;
  }

  async updateUserRoles(user: any, rolesUserDto: RolesUserDto) {
    const change_user: Users = await this.userRepository.findOne({
      relations: {
        empresa: true,
      },
      where: { nid: rolesUserDto.user_nid },
    });

    if (user.empresa.nid == change_user.empresa.nid) {
      const old_user_roles = await this.userrolesRepository.find({
        relations: {
          user: true,
          rol: true,
        },
        where: { user: { id: change_user.id } },
      });
      const to_delete = [];
      for (const ur_idx in old_user_roles) {
        console.log(old_user_roles[ur_idx]);
        to_delete.push(old_user_roles[ur_idx].id);
      }
      if (to_delete.length > 0) {
        await this.userrolesRepository.delete(to_delete);
      }

      for (const idx in rolesUserDto.roles) {
        const rol_nid = rolesUserDto.roles[idx];
        const rol = await this.rolesRepository.findOne({
          where: { nid: rol_nid },
        });
        if (rol) {
          const new_obj = new UserRoles();
          new_obj.user = change_user;
          new_obj.rol = rol;
          await this.userrolesRepository.insert(new_obj);
        }
      }
      return { message: 'ok', statusCode: 200 };
    } else {
      throw new ForbiddenException('insufficient privileges');
    }
  }
}
