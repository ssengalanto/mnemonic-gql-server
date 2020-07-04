import { Test, TestingModule } from '@nestjs/testing';

import { authenticatedUserMockData, entityIdMockData } from '@shared/__mocks__';

import { ReminderService } from '../reminder.service';
import { ReminderRepository } from '../reminder.repository';
import { reminderMockData, createReminderInputMockData, remindersMockData } from '../__mocks__';

jest.mock('../reminder.repository.ts');

describe('ReminderService', () => {
  let reminderService: ReminderService;
  let reminderRepository: ReminderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderRepository, ReminderService],
    }).compile();

    reminderService = await module.get<ReminderService>(ReminderService);
    reminderRepository = await module.get<ReminderRepository>(ReminderRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(reminderService).toBeDefined();
    expect(reminderRepository).toBeDefined();
  });

  describe('findById', () => {
    it('should get reminder by specific id', async () => {
      jest.spyOn(reminderRepository, 'findById').mockResolvedValue(reminderMockData);
      const reminder = await reminderService.findById(entityIdMockData);
      expect(reminderRepository.findById).toHaveBeenCalledWith(entityIdMockData);
      expect(reminder).toEqual(reminderMockData);
    });

    it('should return null when reminder does not exists', async () => {
      jest.spyOn(reminderRepository, 'findById').mockResolvedValue(null);
      const reminder = await reminderService.findById(entityIdMockData);
      expect(reminderRepository.findById).toHaveBeenCalledWith(entityIdMockData);
      expect(reminder).toBe(null);
    });
  });

  describe('findAll', () => {
    it('it should find all reminders', async () => {
      jest.spyOn(reminderRepository, 'find').mockResolvedValue(remindersMockData);
      const reminders = await reminderService.findAll();
      expect(reminderRepository.find).toHaveBeenCalled();
      expect(reminders).toEqual(remindersMockData);
    });
  });

  describe('delete', () => {
    it('it should delete a reminder', async () => {
      jest.spyOn(reminderRepository, 'deleteOne').mockResolvedValue(reminderMockData);

      const reminder = await reminderService.delete(entityIdMockData, authenticatedUserMockData.id);

      expect(reminderRepository.deleteOne).toHaveBeenCalledWith(
        entityIdMockData,
        authenticatedUserMockData.id,
      );
      expect(reminder).toEqual(reminderMockData);
    });
  });

  describe('create', () => {
    it('it should create a reminder by current user', async () => {
      jest.spyOn(reminderRepository, 'createOne').mockResolvedValue(reminderMockData);
      const reminder = await reminderService.create(
        createReminderInputMockData,
        authenticatedUserMockData,
      );
      expect(reminderRepository.createOne).toHaveBeenCalledWith(
        createReminderInputMockData,
        authenticatedUserMockData,
      );
      expect(reminder).toEqual(reminderMockData);
    });
  });

  describe('findUserReminders', () => {
    it('it should find all reminder of the user with the provided userId', async () => {
      jest.spyOn(reminderRepository, 'find').mockResolvedValue(remindersMockData);
      const reminders = await reminderService.findUserReminders(entityIdMockData);
      expect(reminderRepository.find).toHaveBeenCalledWith({
        where: { userId: entityIdMockData },
      });
      expect(reminders).toEqual(remindersMockData);
    });
  });
});
