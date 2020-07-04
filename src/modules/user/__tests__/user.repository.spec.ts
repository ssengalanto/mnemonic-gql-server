import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  entityIdMockData,
  successUpdateMockData,
  failedUpdateMockData,
  successDeleteMockData,
} from '@shared/__mocks__';

import { UserRepository } from '../user.repository';
import { userMockData, createUserInputMockData, updateUserInputMockData } from '../__mocks__';

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

  describe('findById', () => {
    it('should find user by id', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMockData);

      const user = await userRepository.findById(entityIdMockData);

      expect(userRepository.findOne).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toEqual(userMockData);
    });

    it('should return null when user does not exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      const user = await userRepository.findById(entityIdMockData);

      expect(userRepository.findOne).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toBe(null);
    });
  });

  describe('createOne', () => {
    it('should create a new user entity', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValue(userMockData);
      jest.spyOn(userRepository, 'save').mockResolvedValue(userMockData);

      const user = await userRepository.createOne(createUserInputMockData);

      expect(userRepository.create).toHaveBeenCalledWith(createUserInputMockData);
      expect(userRepository.save).toHaveBeenCalledWith(user);
      expect(user).toEqual(userMockData);
    });

    it('should throw a ConflictException when email already exists', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValue(userMockData);
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: '23505' });

      try {
        await userRepository.createOne(createUserInputMockData);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(userRepository.create).toHaveBeenCalledWith(createUserInputMockData);
      }
    });

    it('should throw an InternalServerErrorException when userRepository.save fails with an error code that is not equal to "23505"', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValue(userMockData);
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: 'any' });

      try {
        await userRepository.createOne(createUserInputMockData);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(userRepository.create).toHaveBeenCalledWith(createUserInputMockData);
      }
    });
  });

  describe('updateOne', () => {
    it('should return a user with updated values', async () => {
      jest.spyOn(userRepository, 'update').mockResolvedValue(successUpdateMockData);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMockData);

      const user = await userRepository.updateOne(entityIdMockData, updateUserInputMockData);

      expect(userRepository.update).toHaveBeenCalledWith(entityIdMockData, updateUserInputMockData);
      expect(userRepository.findOne).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toEqual(userMockData);
    });

    it('should return null when the update fails', async () => {
      jest.spyOn(userRepository, 'update').mockResolvedValue(failedUpdateMockData);
      jest.spyOn(userRepository, 'findOne').mockImplementation();

      const user = await userRepository.updateOne(entityIdMockData, updateUserInputMockData);

      expect(userRepository.update).toHaveBeenCalledWith(entityIdMockData, updateUserInputMockData);
      expect(userRepository.findOne).not.toHaveBeenCalled();
      expect(user).toBe(null);
    });
  });

  describe('deleteOne', () => {
    it('should return the deleted user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMockData);
      jest.spyOn(userRepository, 'delete').mockResolvedValue(successDeleteMockData);

      const user = await userRepository.deleteOne(entityIdMockData);

      expect(userRepository.findOne).toHaveBeenCalledWith(entityIdMockData);
      expect(userRepository.delete).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toEqual(userMockData);
    });

    it('should return null when delete fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'delete').mockImplementation();

      const user = await userRepository.deleteOne(entityIdMockData);

      expect(userRepository.findOne).toHaveBeenCalledWith(entityIdMockData);
      expect(userRepository.delete).not.toHaveBeenCalled();
      expect(user).toBe(null);
    });
  });
});
