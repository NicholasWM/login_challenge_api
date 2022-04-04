import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { SignUpServiceDTO } from 'src/interfaces/auth.interface';
import { User } from 'src/user/user.model';

import { SignInDTO } from './dtos/sign-in-dto';

@Injectable()
export class AuthProvider {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  async createUser(signUpServiceDTO: SignUpServiceDTO) {
    const {
      email,
      hasPermission,
      name,
      password,
      phoneNumber,
      imageExternalUrl,
      imageName,
    } = signUpServiceDTO;
    const salt = await bcrypt.genSalt();
    const user = await this.userModel.create({
      email,
      hasPermission,
      password: await bcrypt.hash(password, salt),
      name,
      phoneNumber,
      salt,
      imageExternalUrl,
      imageName,
    });
    return {
      email: user.email,
      hasPermission: user.hasPermission,
      name: user.name,
      phoneNumber: user.phoneNumber,
      id: user.id,
      imageExternalUrl,
    };
  }

  async findAndCount(email: string) {
    return await this.userModel.findAndCountAll({
      where: {
        email,
      },
    });
  }

  private checkPassword = async (
    password: string,
    user: User,
  ): Promise<boolean> => {
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
  };

  checkCredentials = async (signInDTO: SignInDTO): Promise<User> => {
    const { email, password } = signInDTO;
    const user = await this.userModel.findOne({ where: { email } });

    if (user && (await this.checkPassword(password, user))) {
      return user;
    } else {
      return null;
    }
  };
}
