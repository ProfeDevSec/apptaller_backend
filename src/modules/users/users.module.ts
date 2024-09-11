import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../models/entities/Users';
import { UserRoles } from '../../models/entities/UserRoles';
import { Roles } from '../../models/entities/Roles';
import { Personas } from '../../models/entities/Personas';
import { Empresas } from '../../models/entities/Empresas';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Users, UserRoles, Roles, Personas, Empresas]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
