import { Test, TestingModule } from '@nestjs/testing';

import { entityIdMockData, authenticatedUserMockData } from '@shared/__mocks__';

import { ReminderResolver } from './reminder.resolver';
import { ReminderService } from './reminder.service';
import { reminderMockData, createReminderInputMockData, remindersMockData } from './__mocks__';

jest.mock('./reminder.service.ts');

describe('ReminderResolver', () => {
  let reminderResolver: ReminderResolver;
  let reminderService: ReminderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderResolver, ReminderService],
    }).compile();

    reminderResolver = await module.get<ReminderResolver>(ReminderResolver);
    reminderService = await module.get<ReminderService>(ReminderService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(reminderResolver).toBeDefined();
    expect(reminderService).toBeDefined();
  });

  describe('getById', () => {
    it('should get reminder by id', async () => {
      jest.spyOn(reminderService, 'findById').mockResolvedValue(reminderMockData);
      const reminder = await reminderResolver.getById(entityIdMockData);
      expect(reminderService.findById).toHaveBeenCalledWith(entityIdMockData);
      expect(reminder).toEqual(reminderMockData);
    });
  });

  describe('getAll', () => {
    it('it should get all reminders', async () => {
      jest.spyOn(reminderService, 'findAll').mockResolvedValue(remindersMockData);
      const reminders = await reminderResolver.getAll();
      expect(reminderService.findAll).toHaveBeenCalled();
      expect(reminders).toEqual(remindersMockData);
    });
  });

  describe('delete', () => {
    it('it should delete a reminder', async () => {
      jest.spyOn(reminderService, 'delete').mockResolvedValue(reminderMockData);
      const reminder = await reminderResolver.delete(entityIdMockData, authenticatedUserMockData);
      expect(reminderService.delete).toHaveBeenCalledWith(
        entityIdMockData,
        authenticatedUserMockData.id,
      );
      expect(reminder).toEqual(reminderMockData);
    });
  });

  describe('create', () => {
    it('it should create a reminder by current user', async () => {
      jest.spyOn(reminderService, 'create').mockResolvedValue(reminderMockData);
      const reminder = await reminderResolver.create(
        createReminderInputMockData,
        authenticatedUserMockData,
      );
      expect(reminderService.create).toHaveBeenCalledWith(
        createReminderInputMockData,
        authenticatedUserMockData,
      );
      expect(reminder).toEqual(reminderMockData);
    });
  });
});
