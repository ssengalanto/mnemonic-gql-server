import { Test, TestingModule } from '@nestjs/testing';

import { entityIdMockData } from '@shared/__mocks__';

import { userMockData } from './__mocks__';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

jest.mock('./user.repository.ts');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, UserService],
    }).compile();

    userService = await module.get<UserService>(UserService);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('getById', () => {
    it('should find a user by id', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMockData);

      const user = await userService.findById(entityIdMockData);

      expect(userRepository.findOne).toHaveBeenLastCalledWith(entityIdMockData);
      expect(user).toEqual(userMockData);
    });

    it('should return undefined when user does not exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      const user = await userService.findById(entityIdMockData);

      expect(userRepository.findOne).toHaveBeenLastCalledWith(entityIdMockData);
      expect(user).toEqual(undefined);
    });
  });
});
