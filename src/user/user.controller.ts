import * as fs from 'fs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { options } from 'src/config/upload';
import { DeleteUserDTO } from './dtos/delete-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users;
  }

  @ApiParam({ name: 'userId', type: 'number', required: true })
  @Get('image/:userId')
  async getImage(@Param('userId') id, @Res() res) {
    const user = await this.userService.findById(id);
    const responseImage = res.sendFile(user.imageName, {
      root: `./uploads`,
    });
    return {
      status: HttpStatus.OK,
      data: responseImage,
    };
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        //   return await this.authService.signIn(signInDTO);
        id: { type: 'number' },
        email: { type: 'string' },
        name: { type: 'string' },
        password: { type: 'string' },
        passwordConfirmation: { type: 'string' },
        phoneNumber: { type: 'string' },
        hasPermission: { type: 'boolean' },
        image: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', options))
  @Put()
  async updateUser(
    @Body(ValidationPipe) updateUserDTO: UpdateUserDTO,
  ): Promise<any> {
    if (await this.userService.update(updateUserDTO)) {
      return {
        message: 'User is updated!',
      };
    }
    return {
      message: 'Error to update user!',
    };
  }

  @Delete()
  async remove(
    @Body(ValidationPipe) deleteUserDTO: DeleteUserDTO,
  ): Promise<any> {
    try {
      await this.userService.remove(deleteUserDTO.id);
      return { message: 'User has been deleted!' };
    } catch (error) {
      return { message: 'An error ocurred to delete user' };
    }
  }
}
