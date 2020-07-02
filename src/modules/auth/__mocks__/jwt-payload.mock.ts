import faker from 'faker';

import { JwtPayload } from '../interfaces';

export const jwtPayloadMockData: JwtPayload = {
  sub: faker.random.uuid(),
  email: faker.internet.email(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
};
