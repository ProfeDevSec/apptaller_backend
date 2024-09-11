import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { Empresas } from './models/entities/Empresas';
import { Configuraciones } from './models/entities/Configuraciones';
import { Users } from './models/entities/Users';
import { Personas } from './models/entities/Personas';
import { UserRoles } from './models/entities/UserRoles';
import { Roles } from './models/entities/Roles';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './modules/email/email.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db_taller.sqlite',
      synchronize: true,
      /*
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
       */
      //entities: [__dirname + '/**/models/entities/*{.ts,.js}'],
      entities: [Empresas, Configuraciones, Users, Personas, UserRoles, Roles],
      // autoLoadEntities: false,
      // synchronize: false,
    }),
    AuthModule,
    UsersModule,
    CompaniesModule,
    EmailModule,
    RolesModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
