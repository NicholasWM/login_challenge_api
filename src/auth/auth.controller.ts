import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { options } from 'src/config/upload';
import { ImagesService } from 'src/images/images.service';
import { AuthService } from './auth.service';
import { SignInDTO } from './dtos/sign-in-dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.model';
import { GetUser } from './get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly imagesService: ImagesService,
  ) {}

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
    try {
      const user = await this.authService.signUp({
        ...createUserDTO,
        imageName: file?.filename || '',
        imageExternalUrl: file
          ? await this.imagesService.uploadImageToImgBB(file.filename)
          : '',
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

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
