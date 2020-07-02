import { Test, TestingModule } from '@nestjs/testing';

import { entityIdMockData } from '@shared/__mocks__';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { userMockData } from './__mocks__';

jest.mock('./user.service.ts');

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, UserService],
    }).compile();

    userResolver = await module.get<UserResolver>(UserResolver);
    userService = await module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('hello', () => {
    it('should print hi', () => {
      const greeting = userResolver.hello();
      expect(greeting).toBe('hi');
    });
  });

  describe('getById', () => {
    it('should find a user by id', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(userMockData);

      const user = await userResolver.getById(entityIdMockData);

      expect(userService.findById).toHaveBeenLastCalledWith(entityIdMockData);
      expect(user).toEqual(userMockData);
    });

    it('should return undefined when user does not exists', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(undefined);

      const user = await userResolver.getById(entityIdMockData);

      expect(userService.findById).toHaveBeenLastCalledWith(entityIdMockData);
      expect(user).toEqual(undefined);
    });
  });
});
