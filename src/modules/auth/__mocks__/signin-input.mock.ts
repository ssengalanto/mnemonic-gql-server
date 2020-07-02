import faker from 'faker';

import { SigninUserInput } from '../inputs';

export const signinInputMockData: SigninUserInput = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};
