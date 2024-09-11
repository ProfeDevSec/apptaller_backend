import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Empresas } from './Empresas';

@Index('configuraciones_pkey', ['id'], { unique: true })
@Entity('configuraciones', { schema: 'public' })
export class Configuraciones {
  @Column('integer', { primary: true, name: 'id', generated: 'increment' })
  id: number;

  @Column('integer', { name: 'tipo' })
  tipo: number;

  @Column('integer', { name: 'prioridad', nullable: true })
  prioridad: number | null;

  @Column('text', {
    name: 'valor',
    nullable: true,
  })
  valor: string | null;

  @Column('text', {
    name: 'nid',
    nullable: true,
    default: () => '(lower(hex(randomblob(16))))',
  })
  nid: string | null;

  @ManyToOne(() => Empresas, (empresas) => empresas.configuraciones)
  @JoinColumn([{ name: 'empresa_id', referencedColumnName: 'id' }])
  empresa: Empresas;
}
