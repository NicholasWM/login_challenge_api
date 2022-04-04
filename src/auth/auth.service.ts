import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignInDTO } from './dtos/sign-in-dto';
import { SignUpServiceDTO } from 'src/interfaces/auth.interface';
import { AuthProvider } from './auth.provider';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    private authProvider: AuthProvider,
  ) {}

  async signUp(signUpServiceDTO: SignUpServiceDTO): Promise<any> {
    if (signUpServiceDTO.password !== signUpServiceDTO.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      const { count: exists } = await this.authProvider.findAndCount(
        signUpServiceDTO.email,
      );
      if (!exists) {
        const user = await this.authProvider.createUser(signUpServiceDTO);
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
    const user = await this.authProvider.checkCredentials(signInDTO);
    if (user === null) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }
    const jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = this.jwtService.sign(jwtPayload);

    return { id: user.id, name: user.name, email: user.email, token };
  }
}
