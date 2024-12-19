import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('buildings')
export class Building {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  building: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  locationNumber: string;

  @Column({ type: 'varchar', length: 50 })
  area: string;

  @ManyToOne(() => Building, (parent) => parent.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Building;

  @OneToMany(() => Building, (child) => child.parent)
  children: Building[];
}
