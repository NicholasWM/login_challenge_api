import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [UserModule],
  controllers: [ImagesController],
  exports: [ImagesService],
  providers: [ImagesService],
})
export class ImagesModule {}
