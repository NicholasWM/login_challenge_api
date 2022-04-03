import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { User } from 'src/user/user.model';
import * as bcrypt from 'bcrypt';
import { SignInDTO } from './dtos/sign-in-dto';

interface SignUpServiceDTO extends CreateUserDTO {
  imageName: string;
  imageExternalUrl: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    private jwtService: JwtService,
  ) {}

  async signUp(signUpServiceDTO: SignUpServiceDTO): Promise<any> {
    const createUser = async (signUpServiceDTO: SignUpServiceDTO) => {
      const {
        email,
        hasPermission,
        name,
        password,
        phoneNumber,
        imageExternalUrl,
        imageName,
      } = signUpServiceDTO;
      console.log(signUpServiceDTO);
      const salt = await bcrypt.genSalt();
      const user = await this.userModel.create({
        email,
        hasPermission,
        password: await bcrypt.hash(password, salt),
        name,
        phoneNumber,
        salt,
        imageExternalUrl,
        imageName,
      });
      return {
        email: user.email,
        hasPermission: user.hasPermission,
        name: user.name,
        phoneNumber: user.phoneNumber,
        id: user.id,
        imageExternalUrl,
      };
    };
    if (signUpServiceDTO.password !== signUpServiceDTO.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      const { count: number, rows: exists } =
        await this.userModel.findAndCountAll({
          where: {
            email: signUpServiceDTO.email,
          },
        });
      if (!number) {
        const user = await createUser(signUpServiceDTO);
        const jwtPayload = {
          id: user.id,
          name: user.name,
        };
        const token = await this.jwtService.sign(jwtPayload);
        return { ...user, token };
      }
      return null;
    }
  }

  async signIn(signInDTO: SignInDTO) {
    const checkPassword = async (
      password: string,
      user: User,
    ): Promise<boolean> => {
      const hash = await bcrypt.hash(password, user.salt);
      return hash === user.password;
    };
    const checkCredentials = async (signInDTO: SignInDTO): Promise<User> => {
      const { email, password } = signInDTO;
      const user = await this.userModel.findOne({ where: { email } });

      if (user && (await checkPassword(password, user))) {
        return user;
      } else {
        return null;
      }
    };
    const user = await checkCredentials(signInDTO);
    if (user === null) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }
    const jwtPayload = {
      id: user.id,
      name: user.name,
    };
    const token = this.jwtService.sign(jwtPayload);

    return { id: user.id, name: user.name, email: user.email, token };
  }
}
