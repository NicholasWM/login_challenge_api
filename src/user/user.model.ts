import {
  Model,
  Table,
  Column,
  CreatedAt,
  PrimaryKey,
} from 'sequelize-typescript';

@Table
export class User extends Model {
  @PrimaryKey
  id: string;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  phoneNumber: string;

  @Column
  password: string;

  @Column({ defaultValue: false })
  hasPermission: boolean;

  @CreatedAt
  createdAt: Date;
}
