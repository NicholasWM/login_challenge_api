import { CreateUserDTO } from 'src/user/dtos/create-user.dto';

export interface SignUpServiceDTO extends CreateUserDTO {
  imageName: string;
  imageExternalUrl: string;
}
