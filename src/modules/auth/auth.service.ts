import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { DataSource, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Empresas } from '../../models/entities/Empresas';
import { Personas } from '../../models/entities/Personas';
import { Users } from '../../models/entities/Users';
import { RecoverDto } from './dto/recover.dto';
import { ChangePwdDto } from './dto/change-pwd.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { generateRandomString, CharacterSetType } from 'ts-randomstring/lib';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    @InjectRepository(Empresas)
    private empresaRepository: Repository<Empresas>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    @InjectRepository(Personas)
    private personaRepository: Repository<Personas>,

    private eventEmitter: EventEmitter2,
  ) {}

  async signIn(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    let where: any;
    // VULN untrusted data to log
    console.log('Itento de login user: ' + username);
    if (username.includes('@')) {
      where = {
        email: username,
      };
    } else {
      throw new UnauthorizedException('use valid email for login!');
    }

    const user: Users = await this.userRepository.findOne({
      select: ['id', 'email', 'nid', 'passwordDigest', 'empresa'],
      relations: {
        userRoles: true,
        empresa: true,
      },
      where: where,
    });

    // VULN user enumeration
    if (!user) throw new UnauthorizedException('usuario incorrecto!');

    const res = await bcrypt.compare(password, user.passwordDigest);

    if (!res) {
      throw new UnauthorizedException('contraseña incorrecta!');
    }

    if (user.empresa) {
      const empresa = user.empresa;
      if (!empresa.habilitada) {
        throw new UnauthorizedException('Usuario de la empresa dada de baja!');
      }
    }

    delete user.passwordDigest;

    return {
      token: this.getJwtToken({ id: user.nid.toString() }),
      refreshToken: this.getRefreshToken({ id: user.nid.toString() }),
    };
  }

  async signOut() {
    return {
      token: this.getEmptyToken(),
      refreshToken: this.getEmptyToken(),
    };
  }

  async refresh(user: any) {
    // console.log('refreshing token');
    return {
      token: this.getJwtToken({ id: user.nid.toString() }),
      refreshToken: this.getRefreshToken({ id: user.nid.toString() }),
    };
  }

  async recover(recoverDto: RecoverDto) {
    const { email } = recoverDto;
    const response_txt = 'Nueva contraseña enviada a email registrado!';

    const user: Users = await this.userRepository.findOne({
      select: {
        id: true,
        email: true,
        nid: true,
        passwordDigest: true,
      },
      relations: {
        userRoles: true,
        empresa: true,
      },
      where: {
        email: email,
      },
    });

    // todo intento debe terminar en mensaje de exito
    if (!user) {
      return { message: response_txt };
    }

    if (user.empresa) {
      const empresa = user.empresa;
      if (!empresa.habilitada) {
        // VULN
        throw new UnauthorizedException('Empresa del usuario dada de baja!');
      }
    }

    const personas = await this.personaRepository.find({
      select: {
        nombres: true,
        apellidoPaterno: true,
      },
      where: {
        user: { id: user.id },
      },
    });

    delete user.userRoles;

    const new_password = generateRandomString({
      // VULN weak password
      length: 5,
      charSetType: CharacterSetType.Numeric,
    });

    const salt = await bcrypt.genSalt();
    const encrypt_pwd = await bcrypt.hash(new_password, salt);

    user.passwordDigest = encrypt_pwd;

    const res = await this.userRepository.save(user);

    if (!res) {
      throw new HttpException(
        'Error en cambio de contraseña',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // notify event driver
    this.eventEmitter.emit('user.reset-password', {
      email: user.email,
      password: new_password,
      nombre: personas[0].nombres + ' ' + personas[0].apellidoPaterno,
    });

    return { message: response_txt };
  }

  async changePassword(user: any, changePwdDto: ChangePwdDto) {
    const { password, new_password, retype_password } = changePwdDto;

    // TODO aplicar logica
    // Chequeo de que la contraseña actual es correcta
    const user_obj: Users = await this.userRepository.findOne({
      select: ['id', 'email', 'nid', 'passwordDigest'],
      relations: {
        userRoles: true,
      },
      where: {
        nid: user.nid,
      },
    });

    if (!user_obj) {
      throw new HttpException(
        'Error en cambio de contraseña',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const res = await bcrypt.compare(password, user_obj.passwordDigest);

    if (res) {
      if (new_password == retype_password) { // Si se elimina este IF hay un CWE-602
        const salt = await bcrypt.genSalt();
        const encrypt_pwd = await bcrypt.hash(new_password, salt);
        user_obj.passwordDigest = encrypt_pwd;
        const res2 = await this.userRepository.save(user_obj);
        if (!res2) {
          throw new HttpException(
            'Error en cambio de contraseña',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        // enviarla vía email
        return { message: 'Cambio de Contraseña exitoso!' };
      } else {
        return { message: 'Nuevas Contraseñas ingresadas no son identicas.' };
      }
    } else {
      return { message: 'Contraseña ingresada es invalida!' };
    }
  }

  async getUser(user: any) {
    // Chequeo de que la contraseña actual es correcta
    const user_obj: Users = await this.userRepository.findOne({
      select: {
        id: true,
        email: true,
        nid: true,
        personas: {
          nombres: true,
          apellidoPaterno: true,
        },
        userRoles: {
          rol: {
            codigo: true,
          },
        },
      },
      relations: {
        personas: true,
        userRoles: true,
      },
      where: {
        nid: user.nid,
      },
    });
    if (user_obj) {
      let nombre = null;
      let apellido = null;
      if (user_obj.personas.length > 0) {
        nombre = user_obj.personas[0].nombres;
        apellido = user_obj.personas[0].apellidoPaterno;
      }
      const response = {
        email: user_obj.email,
        nombre: nombre,
        apellido: apellido,
        roles: user_obj.userRoles,
      };
      return response;
    }
    return { message: 'User not found' };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private getRefreshToken(payload: JwtPayload) {
    const refresh = this.jwtService.sign(payload, { expiresIn: '2h' });
    return refresh;
  }

  private getEmptyToken() {
    const refresh = this.jwtService.sign(
      { id: '018e80a4-b9a9-7cdd-999f-2cc81b26217a' },
      { expiresIn: '1s' },
    );
    return refresh;
  }
}
