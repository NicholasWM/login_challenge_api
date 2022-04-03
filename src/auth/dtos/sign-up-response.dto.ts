import { UserAttributes } from 'src/user/user.model';

interface UserWToken extends UserAttributes {
  token: string;
}
export class SignUpResponse {
  user?: UserWToken;
  message: string;
}
