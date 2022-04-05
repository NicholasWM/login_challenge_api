import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { SECRET } from 'src/config';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);
  constructor(private readonly userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('Use');
    const authHeaders = req.headers.authorization;
    next();
    // if (authHeaders && (authHeaders as string).split(' ')[1]) {
    //   const token = (authHeaders as string).split(' ')[1];
    //   const decoded: any = jwt.verify(token, SECRET);
    //   const user = await this.userService.findById(decoded.id);
    //   if (!user) {
    //     throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
    //   }
    //   req.user = user;
    //   next();
    // } else {
    //   throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    // }
  }
}
