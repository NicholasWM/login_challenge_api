import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { ImagesModule } from 'src/images/images.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserProvider } from './user.provider';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => ImagesModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SequelizeModule.forFeature([User]),
  ],
  providers: [UserService, UserProvider],
  controllers: [UserController],
  exports: [UserService],
})
// export class UserModule {}
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/user');
  }
}
