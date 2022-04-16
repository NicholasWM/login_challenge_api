import * as fs from 'fs';
import * as FormData from 'form-data';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';

import { ImgBBResponse } from 'src/interfaces/imgBB.interface';
import { getImagePath } from 'src/utils/file';
@Injectable()
export class ImagesService {
  async uploadImageToImgBB(filename) {
    try {
      const imagePath = getImagePath(filename);

      const data = new FormData();
      data.append('key', '<YOUR_IMAGE_BB_KEY>');
      data.append('image', fs.createReadStream(imagePath));

      const config: AxiosRequestConfig = {
        method: 'POST',
        url: 'https://api.imgbb.com/1/upload',
        headers: {
          ...data.getHeaders(),
        },
        data: data,
      };
      const response: AxiosResponse<ImgBBResponse> = await axios(config);
      const { url } = response.data.data;

      return url;
    } catch (error) {
      throw new Error(`Upload image to ImgBB failed: ${error}`);
    }
  }
}
