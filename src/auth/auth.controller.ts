import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDTO } from './dtos/sign-in-dto';
import * as fs from 'fs';
import * as FormData from 'form-data';
import path = require('path');
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { options } from 'src/config/upload';
import { ImgBBResponse } from 'src/interfaces/imgBB.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body(ValidationPipe) signInDTO: SignInDTO) {
    return await this.authService.signIn(signInDTO);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        //   return await this.authService.signIn(signInDTO);
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        passwordConfirmation: { type: 'string' },
        phoneNumber: { type: 'string' },
        hasPermission: { type: 'boolean' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', options))
  @Post('signup')
  async uploadFile(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // ):Promise<SignUpResponse> {
    const imagePath = `${process.cwd()}/uploads/${file.filename}`;

    const data = new FormData();
    data.append('key', '76a90c4470db56d9bdaa4bd4e03d222c');
    data.append('image', fs.createReadStream(imagePath));

    const config: AxiosRequestConfig = {
      method: 'POST',
      url: 'https://api.imgbb.com/1/upload',
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    };
    try {
      const response: AxiosResponse<ImgBBResponse> = await axios(config);
      const { url } = response.data.data;
      const user = await this.authService.signUp({
        ...createUserDTO,
        imageName: file.filename,
        imageExternalUrl: url,
      });
      if (!user) {
        return { message: 'Email already exists!' };
      }
      return {
        user,
        message: 'Created!',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
