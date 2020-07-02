import faker from 'faker';

export const entityIdMockData = faker.random.uuid();

export const entityIdsMockData = Array.from({ length: 3 }, () => faker.random.uuid());
