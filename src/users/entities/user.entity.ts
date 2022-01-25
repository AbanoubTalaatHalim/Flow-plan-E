import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '~src/common/entities';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;
}
