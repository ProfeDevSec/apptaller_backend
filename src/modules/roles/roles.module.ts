import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from '../../models/entities/Roles';
import { Users } from '../../models/entities/Users';
import { UserRoles } from '../../models/entities/UserRoles';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Roles, Users, UserRoles])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
