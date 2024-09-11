import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Roles } from './Roles';
import { Users } from './Users';

@Index('user_roles_pkey', ['id'], { unique: true })
@Entity('user_roles', { schema: 'public' })
export class UserRoles {
  @Column('integer', {
    primary: true,
    name: 'id',
    generated: 'increment',
  })
  id: number;

  @ManyToOne(() => Roles, (roles) => roles.userRoles, { eager: true })
  @JoinColumn([{ name: 'rol_id', referencedColumnName: 'id' }])
  rol: Roles;

  @ManyToOne(() => Users, (users) => users.userRoles)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
