import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './user.model';
import { UpdateAvatarDTO } from 'src/interfaces/user.interfaces';
import { deleteFile } from 'src/utils/file';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class UserProvider {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly imagesService: ImagesService,
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

  async updateAvatar({ id, filename }: UpdateAvatarDTO) {
    const user = await this.userModel.findByPk(id);
    if (user.imageName) {
      await deleteFile(user.imageName);
    }
    user.imageName = filename;
    user.imageExternalUrl = await this.imagesService.uploadImageToImgBB(
      filename,
    );
    user.save();
  }

  async updateOne(
    updateUserDTO: UpdateUserDTO,
    filename?: string,
  ): Promise<User> {
    const user = await this.userModel.findByPk(updateUserDTO.id);
    if (!user) {
      return null;
    }
    Object.keys(updateUserDTO).forEach(async (item) => {
      console.log(`${item} => ${user[item]} = ${updateUserDTO[item]}`);
      const exclude = ['password', 'password', 'passwordConfirmation', 'id'];
      const simpleFields = ['hasPermission', 'name', 'phoneNumber'];
      if (
        item === 'password' &&
        updateUserDTO?.passwordConfirmation &&
        updateUserDTO?.passwordConfirmation === updateUserDTO.password
      ) {
        user[item] = await bcrypt.hash(updateUserDTO[item], user.salt);
        user.save();
      }
      if (item === 'email' && updateUserDTO.email) {
        const { rows } = await this.userModel.findAndCountAll({
          where: { email: updateUserDTO.email },
        });
        if (!rows.length) {
          console.log('Updating Email');
          user.email = updateUserDTO[item];
          user.save();
        }
      }
      if (simpleFields.includes(item)) {
        if (updateUserDTO[item]) {
          user[item] = updateUserDTO[item];
          user.save();
        }
      }
    });
    if (filename) {
      await this.updateAvatar({ id: updateUserDTO.id, filename });
    }
    return user;
  }
}
