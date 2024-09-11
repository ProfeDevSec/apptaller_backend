import { Column, Entity, Index, OneToMany } from 'typeorm';
import { UserRoles } from './UserRoles';

@Index('roles_pkey', ['id'], { unique: true })
@Entity('roles', { schema: 'public' })
export class Roles {
  @Column('integer', { primary: true, name: 'id', generated: 'increment' })
  id: number;

  @Column('text', { name: 'codigo' })
  codigo: string;

  @Column('text', { name: 'descripcion' })
  descripcion: string;

  @Column('text', {
    name: 'nid',
    nullable: true,
    default: () => '(lower(hex(randomblob(16))))',
  })
  nid: string | null;

  @OneToMany(() => UserRoles, (userRoles) => userRoles.rol)
  userRoles: UserRoles[];
}
