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
      jest.spyOn(userRepository, 'findById').mockResolvedValue(userMockData);

      const user = await userService.findById(entityIdMockData);

      expect(userRepository.findById).toHaveBeenLastCalledWith(entityIdMockData);
      expect(user).toEqual(userMockData);
    });

    it('should return null when user does not exists', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      const user = await userService.findById(entityIdMockData);

      expect(userRepository.findById).toHaveBeenLastCalledWith(entityIdMockData);
      expect(user).toBe(null);
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
      jest.spyOn(userRepository, 'updateOne').mockResolvedValue(userMockData);

      const user = await userService.update(entityIdMockData, updateUserInputMockData);

      expect(userRepository.updateOne).toHaveBeenCalledWith(
        entityIdMockData,
        updateUserInputMockData,
      );
      expect(user).toEqual(userMockData);
    });

    it('should return null when the update fails', async () => {
      jest.spyOn(userRepository, 'updateOne').mockResolvedValue(null);

      const user = await userService.update(entityIdMockData, updateUserInputMockData);

      expect(userRepository.updateOne).toHaveBeenCalledWith(
        entityIdMockData,
        updateUserInputMockData,
      );
      expect(user).toBe(null);
    });
  });

  describe('deleteOne', () => {
    it('should return the deleted user', async () => {
      jest.spyOn(userRepository, 'deleteOne').mockResolvedValue(userMockData);

      const user = await userService.delete(entityIdMockData);

      expect(userRepository.deleteOne).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toEqual(userMockData);
    });

    it('should return null when delete fails', async () => {
      jest.spyOn(userRepository, 'deleteOne').mockResolvedValue(null);

      const user = await userService.delete(entityIdMockData);

      expect(userRepository.deleteOne).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toBe(null);
    });
  });
});
