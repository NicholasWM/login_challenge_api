import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: {
        exclude: ['password', 'salt'],
      },
    });
  }

  async findById(id: number): Promise<User> {
    return this.userModel.findOne({
      where: { id },
      attributes: {
        exclude: ['password', 'salt'],
      },
    });
  }

  async update(updateUserDTO: UpdateUserDTO) {
    const user = await this.userModel.findByPk(updateUserDTO.id);
    if (!user) {
      return null;
    }
    Object.keys(updateUserDTO).forEach(async (item) => {
      const exclude = ['password', 'password', 'passwordConfirmation', 'id'];
      if (
        item === 'password' &&
        updateUserDTO?.passwordConfirmation &&
        updateUserDTO?.passwordConfirmation === updateUserDTO.password
      ) {
        user[item] = updateUserDTO[item];
      }
      if (item === 'email') {
        const { rows } = await this.userModel.findAndCountAll({
          where: { email: updateUserDTO.email },
        });
        if (!rows.length) {
          user[item] = updateUserDTO[item];
        }
      }
      if (!exclude.includes(item)) {
        user[item] = updateUserDTO[item];
      }
    });
    user.save();
    return true;
  }

  async remove(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);
    await user.destroy();
  }
}
