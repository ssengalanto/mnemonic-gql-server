import { Test, TestingModule } from '@nestjs/testing';

import {
  authenticatedUserMockData,
  successDeleteMockData,
  entityIdMockData,
  successUpdateMockData,
  failedUpdateMockData,
} from '@shared/__mocks__';

import {
  reminderMockData,
  createReminderInputMockData,
  updateReminderInputMockData,
} from './__mocks__';
import { ReminderRepository } from './reminder.repository';

describe('ReminderRepository', () => {
  let reminderRepository: ReminderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderRepository],
    }).compile();

    reminderRepository = await module.get<ReminderRepository>(ReminderRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(reminderRepository).toBeDefined();
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      jest.spyOn(reminderRepository, 'findOne').mockResolvedValue(reminderMockData);

      const reminder = await reminderRepository.findById(entityIdMockData);

      expect(reminderRepository.findOne).toHaveBeenCalledWith(entityIdMockData);
      expect(reminder).toEqual(reminderMockData);
    });

    it('should return null when reminder does not exists', async () => {
      jest.spyOn(reminderRepository, 'findOne').mockResolvedValue(undefined);

      const reminder = await reminderRepository.findById(entityIdMockData);

      expect(reminderRepository.findOne).toHaveBeenCalledWith(entityIdMockData);
      expect(reminder).toBe(null);
    });
  });

  describe('createOne', () => {
    it('should create a new reminder successfully', async () => {
      jest.spyOn(reminderRepository, 'create').mockReturnValue(reminderMockData);
      jest.spyOn(reminderRepository, 'save').mockResolvedValue(reminderMockData);

      const reminder = await reminderRepository.createOne(
        createReminderInputMockData,
        authenticatedUserMockData,
      );

      expect(reminderRepository.create).toHaveBeenCalledWith({
        ...createReminderInputMockData,
        user: authenticatedUserMockData,
      });
      expect(reminderRepository.save).toHaveBeenCalledWith(reminder);
      expect(reminder).toEqual(reminderMockData);
    });
  });

  describe('updateOne', () => {
    it('should return a user with updated values', async () => {
      jest.spyOn(reminderRepository, 'update').mockResolvedValue(successUpdateMockData);
      jest.spyOn(reminderRepository, 'findOne').mockResolvedValue(reminderMockData);

      const reminder = await reminderRepository.updateOne(
        entityIdMockData,
        updateReminderInputMockData,
      );

      expect(reminderRepository.update).toHaveBeenCalledWith(
        entityIdMockData,
        updateReminderInputMockData,
      );
      expect(reminderRepository.findOne).toHaveBeenCalledWith(entityIdMockData);
      expect(reminder).toEqual(reminderMockData);
    });

    it('should return null when the update fails', async () => {
      jest.spyOn(reminderRepository, 'update').mockResolvedValue(failedUpdateMockData);
      jest.spyOn(reminderRepository, 'findOne').mockImplementation();

      const reminder = await reminderRepository.updateOne(
        entityIdMockData,
        updateReminderInputMockData,
      );

      expect(reminderRepository.update).toHaveBeenCalledWith(
        entityIdMockData,
        updateReminderInputMockData,
      );
      expect(reminderRepository.findOne).not.toHaveBeenCalled();
      expect(reminder).toBe(null);
    });
  });

  describe('deleteOne', () => {
    it('should return the deleted reminder', async () => {
      jest.spyOn(reminderRepository, 'findOne').mockResolvedValue(reminderMockData);
      jest.spyOn(reminderRepository, 'delete').mockResolvedValue(successDeleteMockData);

      const reminder = await reminderRepository.deleteOne(
        entityIdMockData,
        authenticatedUserMockData.id,
      );

      expect(reminderRepository.findOne).toHaveBeenCalledWith(entityIdMockData, {
        where: { userId: authenticatedUserMockData.id },
      });
      expect(reminderRepository.delete).toHaveBeenCalledWith(entityIdMockData);
      expect(reminder).toEqual(reminderMockData);
    });

    it('should return null when delete fails', async () => {
      jest.spyOn(reminderRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(reminderRepository, 'delete').mockImplementation();

      const reminder = await reminderRepository.deleteOne(
        entityIdMockData,
        authenticatedUserMockData.id,
      );

      expect(reminderRepository.findOne).toHaveBeenCalledWith(entityIdMockData, {
        where: { userId: authenticatedUserMockData.id },
      });
      expect(reminderRepository.delete).not.toHaveBeenCalled();
      expect(reminder).toBe(null);
    });
  });
});
