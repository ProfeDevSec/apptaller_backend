import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Personas } from './Personas';
import { UserRoles } from './UserRoles';
import { Empresas } from './Empresas';

@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @Column('integer', {
    primary: true,
    name: 'id',
    generated: 'increment',
  })
  id: number;

  @Column('text', { name: 'password_digest' })
  passwordDigest: string;

  @Column('boolean', { name: 'visible' })
  visible: boolean;

  @Column('text', { name: 'email' })
  email: string;

  @Column('text', {
    name: 'nid',
    nullable: true,
    default: () => '(lower(hex(randomblob(16))))',
  })
  nid: string | null;

  @OneToMany(() => Personas, (personas) => personas.user, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  personas: Personas[];

  @OneToMany(() => UserRoles, (userRoles) => userRoles.user, { eager: true }) // { eager: true }
  userRoles: UserRoles[];

  @ManyToOne(() => Empresas, (empresas) => empresas.users)
  @JoinColumn([{ name: 'empresa_id', referencedColumnName: 'id' }])
  empresa: Empresas;
}
