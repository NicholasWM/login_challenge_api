import { User } from './user/user.model';

export const providers = {
  user: {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
};
