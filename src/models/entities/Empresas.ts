import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Configuraciones } from './Configuraciones';
import { Users } from './Users';

@Index('empresas_pkey', ['id'], { unique: true })
@Entity('empresas', { schema: 'public' })
export class Empresas {
  @Column('integer', {
    primary: true,
    name: 'id',
    generated: 'increment',
  })
  id: number;

  @Column('text', { name: 'nombre' })
  nombre: string;

  @Column('boolean', { name: 'habilitada' })
  habilitada: boolean;

  @Column('text', {
    name: 'nombre_contacto',
    nullable: true,
  })
  nombreContacto: string | null;

  @Column('text', {
    name: 'contacto_email',
    nullable: true,
  })
  contactoEmail: string | null;

  @Column('text', {
    name: 'nid',
    nullable: true,
    default: () => '(lower(hex(randomblob(16))))',
  })
  nid: string | null;

  @OneToMany(
    () => Configuraciones,
    (configuraciones) => configuraciones.empresa,
  )
  configuraciones: Configuraciones[];

  @OneToMany(() => Users, (users) => users.empresa)
  users: Users[];
}
