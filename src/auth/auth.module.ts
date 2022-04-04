import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { JwtStrategy } from './jwt.strategy';
import { SECRET } from 'src/config';
import { AuthProvider } from './auth.provider';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [
    ImagesModule,
    SequelizeModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: SECRET,
      signOptions: {
        expiresIn: 18000,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthProvider],
  exports: [AuthService],
})
export class AuthModule {}
