import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty({
    default: 6,
  })
  id: number;
  @ApiProperty({
    default: 'abc@abc.com',
    description: 'User email',
  })
  email?: string;

  @ApiProperty({
    default: 'Abc Client',
  })
  name?: string;

  @ApiProperty({
    default: 'secret123',
  })
  password?: string;

  @ApiProperty({
    default: false,
  })
  hasPermission?: boolean;

  @ApiProperty({
    default: 'secret123',
  })
  passwordConfirmation?: string;

  @ApiProperty({
    default: 'secret123',
  })
  phoneNumber?: string;

  @ApiProperty()
  image?: Express.Multer.File;

  // @ApiProperty()
  // image: string;

  // @ApiProperty({
  //   default:
  //     'https://lh3.googleusercontent.com/ogw/ADGmqu-0gz0tf6fAB-y6UXo9Zj4Eacrua_KG1pATBPRkWA=s83-c-mo',
  //   description: 'URL of an image of the User',
  // })
  // photoURI: string;
}
