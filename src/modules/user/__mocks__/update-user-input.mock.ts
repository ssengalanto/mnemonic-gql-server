import faker from 'faker';

import { UpdateUserInput } from '../inputs';

export const updateUserInputMockData: UpdateUserInput = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  active: true,
};
