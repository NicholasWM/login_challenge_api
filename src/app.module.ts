import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImagesController } from './images/images.controller';
import { ImagesModule } from './images/images.module';
import { LoggingMiddleware } from './middlewares/logging.middleware';

@Module({
  imports: [
    MulterModule.register({
      dest: '../../upload',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'db_lca',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'login_challenge',
      models: [User],
      autoLoadModels: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ImagesModule,
  ],
  controllers: [ImagesController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
