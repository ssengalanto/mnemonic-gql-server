import { Test, TestingModule } from '@nestjs/testing';

import { entityIdMockData } from '@shared/__mocks__';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { userMockData, usersMockData } from './__mocks__';

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

  describe('getById', () => {
    it('should return a user with the correct id', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(userMockData);

      const user = await userResolver.getById(entityIdMockData);

      expect(userService.findById).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toEqual(userMockData);
    });

    it('should return null when user does not exists', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      const user = await userResolver.getById(entityIdMockData);

      expect(userService.findById).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toBe(null);
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValue(usersMockData);

      const users = await userResolver.getAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(users).toEqual(usersMockData);
    });
  });
});
