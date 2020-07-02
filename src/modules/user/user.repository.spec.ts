import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from './user.repository';
import { userMockData, createUserInputMockData } from './__mocks__';

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
});
