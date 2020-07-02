import faker from 'faker';

import { UpdateUserInput } from '../inputs';

export const updateUserInputMockData: UpdateUserInput = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  active: true,
};
