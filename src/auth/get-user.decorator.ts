import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/user/user.model';

export const GetUser = createParamDecorator((data, req): User => {
  return req.args[0].user;
});
