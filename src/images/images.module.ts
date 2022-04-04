import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ImagesController } from './images.controller';

@Module({
  imports: [UserModule],
  controllers: [ImagesController],
  exports: [ImagesModule],
})
export class ImagesModule {}
