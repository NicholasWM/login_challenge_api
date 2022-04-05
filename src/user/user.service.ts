import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { deleteFile } from 'src/utils/file';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './user.model';
import { UserProvider } from './user.provider';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    private userProvider: UserProvider,
  ) {}
  async findAll(): Promise<User[]> {
    return await this.userProvider.findAll();
  }

  async findById(id: number): Promise<User> {
    return await this.userProvider.findById(id);
  }

  async update(updateUserDTO: UpdateUserDTO, filename: string) {
    try {
      await this.userProvider.updateOne(updateUserDTO, filename);
      return true;
    } catch (error) {
      console.log(error);
      throw new Error('Error to update user!');
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (user.imageName) {
      deleteFile(user.imageName);
    }
    await user.destroy();
  }
}
