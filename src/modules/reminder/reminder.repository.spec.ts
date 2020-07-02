import { Test, TestingModule } from '@nestjs/testing';

import { autheranticatedMockUserData } from '@shared/__mocks__';

import { reminderMockData, createReminderInputMockData } from './__mocks__';
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

  describe('createOne', () => {
    it('should create a new reminder successfully', async () => {
      jest.spyOn(reminderRepository, 'create').mockReturnValue(reminderMockData);
      jest.spyOn(reminderRepository, 'save').mockResolvedValue(reminderMockData);

      const reminder = await reminderRepository.createOne(
        createReminderInputMockData,
        autheranticatedMockUserData,
      );

      expect(reminderRepository.create).toHaveBeenCalledWith({
        ...createReminderInputMockData,
        user: autheranticatedMockUserData,
      });
      expect(reminderRepository.save).toHaveBeenCalledWith(reminder);
      expect(reminder).toEqual(reminderMockData);
    });
  });
});
