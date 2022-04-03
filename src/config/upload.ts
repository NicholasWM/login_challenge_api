import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as crypto from 'crypto';
import { diskStorage } from 'multer';
import { resolve } from 'path';
import { imageFileFilter } from 'src/utils/file';

export const options: MulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const fileHash = crypto.randomBytes(16).toString('hex');
      const filename = `${fileHash} - ${file.originalname}`;
      return callback(null, filename);
    },
  }),
  fileFilter: imageFileFilter,
};
