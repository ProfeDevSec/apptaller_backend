import { Injectable, NotFoundException } from '@nestjs/common';
import { ChangeRoleDto, UpdatePersonUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../models/entities/Users';
import { Roles } from '../../models/entities/Roles';
import { UserRoles } from '../../models/entities/UserRoles';
import { Personas } from '../../models/entities/Personas';
import { Empresas } from '../../models/entities/Empresas';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { generateRandomString, CharacterSetType } from 'ts-randomstring/lib';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    @InjectRepository(Personas)
    private personasRepository: Repository<Personas>,

    @InjectRepository(Roles)
    private rolRepository: Repository<Roles>,

    @InjectRepository(UserRoles)
    private userolRepository: Repository<UserRoles>,

    @InjectRepository(Empresas)
    private companyRepository: Repository<Empresas>,

    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(user: any) {
    let users: any;

    if (user.empresa.nid) {
      const empresa_nid = user.empresa.nid;
      users = await this.userRepository.find({
        select: {
          nid: true,
          email: true,
          personas: {
            nombres: true,
            apellidoPaterno: true,
          },
          userRoles: {
            rol: {
              id: true,
              codigo: true,
            },
          },
        },
        relations: {
          personas: true,
          userRoles: true,
        },
        where: {
          empresa: {
            nid: empresa_nid,
          },
        },
      });
    } else {
      throw new NotFoundException('Error al buscar usuarios!');
    }
    return users;
  }

  async changeState(nid: string, newState: number) {
    try {
      console.log(newState);
      const user = await this.userRepository.findOne({
        select: {
          id: true,
          email: true,
          nid: true,
        },
        where: {
          nid: nid,
        },
      });

      user.email = 'deleted_' + user.email;
      const userUpdated = await this.userRepository.save(user);

      return { message: 'Usuario eliminado', userUpdated };
    } catch (error) {
      return { error, message: 'Ha ocurrido un error al eliminar el usuario' };
    }
  }

  async changeRoleByUser(changeRoleDto: ChangeRoleDto) {
    try {
      console.log('ChangeRoleDto: ', { changeRoleDto });

      // Busca en userRoles
      const rol: Roles = await this.rolRepository.findOne({
        where: {
          nid: changeRoleDto.rolNid,
        },
      });

      const user: Users = await this.userRepository.findOne({
        where: {
          nid: changeRoleDto.userNid,
        },
      });

      console.log('rol: ', rol);
      // console.log(user);
      if (!rol) {
        return { status: 'error', message: 'Invalid Rol', statusCode: 200 };
      }

      if (!user) {
        return { status: 'error', message: 'Invalid User', statusCode: 200 };
      }

      let userRol = await this.userolRepository.findOne({
        select: {
          id: true,
        },
        where: {
          rol: {
            id: rol.id,
          },
          user: {
            id: user.id,
          },
        },
      });
      console.log('user rol: ', userRol);

      if (userRol) {
        console.log(changeRoleDto.checked);
        if (!changeRoleDto.checked) {
          const res = await this.userolRepository.delete(userRol);
          console.log(res);
          console.log('delete');
        }
      } else {
        if (changeRoleDto.checked) {
          userRol = new UserRoles();
          userRol.rol = rol;
          userRol.user = user;
          const res = await this.userolRepository.insert(userRol);
          console.log(res);
        }
      }
      return { message: 'ok', statusCode: 200 };
    } catch (error) {
      return { status: 'error', message: error.message, statusCode: 200 };
    }
  }

  async findUserById(user: any, nid: string) {
    try {
      const user: Users = await this.userRepository.findOne({
        select: {
          id: true,
          nid: true,
          email: true,
          personas: {
            nombres: true,
            apellidoPaterno: true,
          },
        },
        relations: {
          personas: true,
        },
        where: {
          nid: nid,
        },
      });

      if (!user) {
        return { status: 'error', message: 'User not found', statusCode: 200 };
      }

      return user;
    } catch (error) {
      return { status: 'error', message: error.message, statusCode: 200 };
    }
  }

  async deleteUserById(user_session: any, nid: string) {
    try {
      const user: Users = await this.userRepository.findOne({
        select: {
          id: true,
          nid: true,
          email: true,
          personas: {
            nombres: true,
            apellidoPaterno: true,
          },
        },
        relations: {
          personas: true,
        },
        where: {
          nid: nid,
        },
      });

      const persona: Personas = await this.personasRepository.findOne({
        where: {
          nid: user.personas[0].nid,
        },
      });

      if (!persona) {
        return {
          status: 'error',
          message: 'Usuario no encontrado',
          statusCode: 200,
        };
      }

      const res_per = await this.personasRepository.remove(persona);
      console.log(res_per);

      const roles: UserRoles[] = await this.userolRepository.find({
        where: {
          user: {
            id: user.id,
          },
        },
      });

      for (const userrol of roles) {
        console.log(userrol);
        const resRol = await this.userolRepository.remove(userrol);
        console.log(resRol);
      }

      if (!user) {
        return {
          status: 'error',
          message: 'Usuario no encontrado',
          statusCode: 200,
        };
      }

      const res = await this.userRepository.remove(user);
      console.log(res);
      return { message: 'ok', statusCode: 200 };
    } catch (error) {
      return { status: 'error', message: error.message, statusCode: 200 };
    }
  }

  async update(user_session: any, nid: string, newData: UpdatePersonUserDto) {
    try {
      const user: Users = await this.userRepository.findOne({
        relations: {
          personas: true,
        },
        where: {
          nid: nid,
        },
      });
      console.log(user);

      let persona: Personas;
      let personInsert = false;
      if (user.personas.length > 0) {
        persona = await this.personasRepository.findOne({
          where: {
            nid: user.personas[0].nid,
          },
        });
      } else {
        personInsert = true;
        persona = new Personas();
        persona.user = user;
      }
      persona.nombres = newData.nombres;
      persona.apellidoPaterno = newData.apellido_paterno;

      user.email = newData.email;

      const res = await this.userRepository.save(user);
      console.log(res);
      if (personInsert) {
        const resPer = await this.personasRepository.insert(persona);
        console.log(resPer);
      } else {
        const resPer = await this.personasRepository.save(persona);
        console.log(resPer);
      }

      return { message: 'ok', statusCode: 200 };
    } catch (error) {
      return { status: 'error', message: error.message, statusCode: 200 };
    }
  }

  async create(user_session: any, newData: UpdatePersonUserDto) {
    try {
      const company: Empresas = await this.companyRepository.findOne({
        where: {
          nid: user_session.empresa.nid,
        },
      });

      const user = new Users();
      user.email = newData.email;
      user.visible = true;
      const new_password = generateRandomString({
        length: 5,
        charSetType: CharacterSetType.Numeric,
      });
      console.log(new_password);
      const salt = await bcrypt.genSalt();
      const encrypt_pwd = await bcrypt.hash(new_password, salt);
      user.passwordDigest = encrypt_pwd;
      user.empresa = company;

      const res = await this.userRepository.insert(user);
      console.log(res);

      const persona = new Personas();
      persona.user = user;
      persona.nombres = newData.nombres;
      persona.apellidoPaterno = newData.apellido_paterno;

      const resPer = await this.personasRepository.insert(persona);
      console.log(resPer);

      const rol = await this.rolRepository.findOne({
        where: {
          id: 2,
        },
      });

      const userrol = new UserRoles();
      userrol.user = user;
      userrol.rol = rol;

      const resRol = await this.userolRepository.insert(userrol);
      console.log(resRol);

      this.eventEmitter.emit('user.create', {
        email: user.email,
        password: new_password,
        nombre: persona.nombres + ' ' + persona.apellidoPaterno,
      });

      return { message: 'ok', statusCode: 200 };
    } catch (error) {
      return { status: 'error', message: error.message, statusCode: 200 };
    }
  }
}
