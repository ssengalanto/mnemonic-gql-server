import { Test, TestingModule } from '@nestjs/testing';

import { entityIdMockData } from '@shared/__mocks__';

import { userMockData, usersMockData, updateUserInputMockData } from './__mocks__';
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

  describe('findById', () => {
    it('should return a user with correct id', async () => {
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

  describe('findAll', () => {
    it('should return all users', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue(usersMockData);

      const users = await userService.findAll();

      expect(userRepository.find).toHaveBeenCalled();
      expect(users).toEqual(usersMockData);
    });
  });

  describe('update', () => {
    it('should return a user with updated values', async () => {
      jest.spyOn(userRepository, 'updateUser').mockResolvedValue(userMockData);

      const user = await userService.update(entityIdMockData, updateUserInputMockData);

      expect(userRepository.updateUser).toHaveBeenCalledWith(
        entityIdMockData,
        updateUserInputMockData,
      );
      expect(user).toEqual(userMockData);
    });

    it('should return undefined when the update fails', async () => {
      jest.spyOn(userRepository, 'updateUser').mockResolvedValue(undefined);

      const user = await userService.update(entityIdMockData, updateUserInputMockData);

      expect(userRepository.updateUser).toHaveBeenCalledWith(
        entityIdMockData,
        updateUserInputMockData,
      );
      expect(user).toEqual(undefined);
    });
  });

  describe('deleteUser', () => {
    it('should return the deleted user', async () => {
      jest.spyOn(userRepository, 'deleteUser').mockResolvedValue(userMockData);

      const user = await userService.delete(entityIdMockData);

      expect(userRepository.deleteUser).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toEqual(userMockData);
    });

    it('should return undefined when delete fails', async () => {
      jest.spyOn(userRepository, 'deleteUser').mockResolvedValue(undefined);

      const user = await userService.delete(entityIdMockData);

      expect(userRepository.deleteUser).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toEqual(undefined);
    });
  });
});
