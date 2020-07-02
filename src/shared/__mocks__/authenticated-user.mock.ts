import faker from 'faker';

import { AuthenticatedUser } from '@shared/interfaces';

export const authenticatedUserMockData: AuthenticatedUser = {
  id: faker.random.uuid(),
  email: faker.internet.email(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
};
