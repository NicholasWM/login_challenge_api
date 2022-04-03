import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User, UserInput } from '../user.model';

export class CreateUserDTO implements UserInput {
  @ApiProperty({
    default: 'abc@abc.com',
    description: 'User email',
  })
  email: string;

  @IsNotEmpty({
    message: 'Informe o nome do usuario',
  })
  @MaxLength(50, {
    message: 'O nome do usuario deve ter menos de 50 caracteres',
  })
  @ApiProperty({
    default: 'Abc Client',
  })
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    default: 'secret123',
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    default: false,
  })
  hasPermission: boolean;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    default: 'secret123',
  })
  passwordConfirmation: string;

  @IsNotEmpty()
  @ApiProperty({
    default: 'secret123',
  })
  phoneNumber: string;

  // @ApiProperty()
  // image: string;

  // @ApiProperty({
  //   default:
  //     'https://lh3.googleusercontent.com/ogw/ADGmqu-0gz0tf6fAB-y6UXo9Zj4Eacrua_KG1pATBPRkWA=s83-c-mo',
  //   description: 'URL of an image of the User',
  // })
  // photoURI: string;
}
