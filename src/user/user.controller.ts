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
  UnauthorizedException,
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
import { GetUser } from 'src/auth/get-user.decorator';
// import { GetUser } from 'src/auth/get-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard())
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
        file: {
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
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    // console.log(file.filename);
    if (await this.userService.update(updateUserDTO, file?.filename)) {
      return {
        status: HttpStatus.OK,
        message: 'User is updated!',
      };
    }
    return {
      status: HttpStatus.BAD_REQUEST,
      message: 'Error to update user!',
    };
  }

  @Delete()
  async remove(
    @GetUser() user: User,
    @Body(ValidationPipe) deleteUserDTO: DeleteUserDTO,
  ): Promise<any> {
    if (user.id !== deleteUserDTO.id) {
      throw new UnauthorizedException();
    }
    try {
      await this.userService.remove(deleteUserDTO.id);
      return { message: 'User has been deleted!', status: HttpStatus.OK };
    } catch (error) {
      return error;
    }
  }
}
