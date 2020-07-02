import { Test, TestingModule } from '@nestjs/testing';

import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let userResolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver],
    }).compile();

    userResolver = await module.get<UserResolver>(UserResolver);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
  });

  describe('hello', () => {
    it('should print hi', () => {
      const greeting = userResolver.hello();
      expect(greeting).toBe('hi');
    });
  });
});
