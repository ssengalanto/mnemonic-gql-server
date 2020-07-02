import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { entityIdMockData, successUpdateMockData, failUpdateMockData } from '@shared/__mocks__';

import { UserRepository } from './user.repository';
import { userMockData, createUserInputMockData, updateUserInputMockData } from './__mocks__';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user entity', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValue(userMockData);
      jest.spyOn(userRepository, 'save').mockResolvedValue(userMockData);

      const user = await userRepository.createUser(createUserInputMockData);

      expect(userRepository.create).toHaveBeenCalledWith(createUserInputMockData);
      expect(userRepository.save).toHaveBeenCalledWith(user);
      expect(user).toEqual(userMockData);
    });

    it('should throw a ConflictException when email already exists', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValue(userMockData);
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: '23505' });

      try {
        await userRepository.createUser(createUserInputMockData);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(userRepository.create).toHaveBeenCalledWith(createUserInputMockData);
      }
    });

    it('should throw an InternalServerErrorException when userRepository.save fails with an error code that is not equal to "23505"', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValue(userMockData);
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: 'any' });

      try {
        await userRepository.createUser(createUserInputMockData);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(userRepository.create).toHaveBeenCalledWith(createUserInputMockData);
      }
    });
  });

  describe('updateUser', () => {
    it('should return a user with updated values', async () => {
      jest.spyOn(userRepository, 'update').mockResolvedValue(successUpdateMockData);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMockData);

      const user = await userRepository.updateUser(entityIdMockData, updateUserInputMockData);

      expect(userRepository.update).toHaveBeenCalledWith(entityIdMockData, updateUserInputMockData);
      expect(userRepository.findOne).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toEqual(userMockData);
    });

    it('should return undefined when the update fails', async () => {
      jest.spyOn(userRepository, 'update').mockResolvedValue(failUpdateMockData);
      jest.spyOn(userRepository, 'findOne').mockImplementation();

      const user = await userRepository.updateUser(entityIdMockData, updateUserInputMockData);

      expect(userRepository.update).toHaveBeenCalledWith(entityIdMockData, updateUserInputMockData);
      expect(userRepository.findOne).not.toHaveBeenCalled();
      expect(user).toEqual(undefined);
    });
  });
});
