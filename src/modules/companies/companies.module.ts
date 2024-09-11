import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresas } from '../../models/entities/Empresas';
import { Users } from '../../models/entities/Users';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Users, Empresas])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
