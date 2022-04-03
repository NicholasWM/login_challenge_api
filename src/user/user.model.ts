/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  Model,
  Table,
  Column,
  CreatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  hasPermission: boolean;
  salt?: string;
  imageName?: string;
  imageExternalUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInput extends Optional<UserAttributes, 'id'> {}
export interface UserOutput extends Optional<UserAttributes, 'password'> {}

@Table
export class User
  extends Model<UserAttributes, UserInput>
  implements UserAttributes
{
  @PrimaryKey
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  phoneNumber: string;

  @Column
  password: string;

  @Column
  salt: string;

  @Column
  imageName: string;

  @Column
  imageExternalUrl: string;

  @Column({ defaultValue: false })
  hasPermission: boolean;

  @CreatedAt
  createdAt: Date;

  // async checkPassword(password: string): Promise<boolean> {
  //   const hash = await bcrypt.hash(password, this.salt);
  //   return hash === this.password;
  // }

  // private async hashPassword(password: string, salt: string): Promise<string> {
  //   return bcrypt.hash(password, salt);
  // }
}
