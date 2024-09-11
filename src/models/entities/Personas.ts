import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Users } from './Users';

@Index('personas_pkey', ['id'], { unique: true })
@Entity('personas', { schema: 'public' })
export class Personas {
  @Column('integer', { primary: true, name: 'id', generated: 'increment' })
  id: number;

  @Column('text', { name: 'nombres' })
  nombres: string;

  @Column('text', { name: 'apellido_paterno' })
  apellidoPaterno: string;

  @Column('text', {
    name: 'nid',
    nullable: true,
    default: () => '(lower(hex(randomblob(16))))',
  })
  nid: string | null;

  @ManyToOne(() => Users, (users) => users.personas)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
