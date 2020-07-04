import { Test, TestingModule } from '@nestjs/testing';

import { entityIdMockData } from '@shared/__mocks__';
import { remindersMockData } from '@modules/reminder/__mocks__';
import { ReminderService } from '@modules/reminder/reminder.service';

import { UserResolver } from '../user.resolver';
import { UserService } from '../user.service';
import { userMockData, usersMockData } from '../__mocks__';

jest.mock('../user.service.ts');
jest.mock('@modules/reminder/reminder.service.ts');

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;
  let reminderService: ReminderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, UserService, ReminderService],
    }).compile();

    userResolver = await module.get<UserResolver>(UserResolver);
    userService = await module.get<UserService>(UserService);
    reminderService = await module.get<ReminderService>(ReminderService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
    expect(userService).toBeDefined();
    expect(reminderService).toBeDefined();
  });

  describe('getById', () => {
    it('should return a user with the correct id', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(userMockData);

      const user = await userResolver.getById(entityIdMockData);

      expect(userService.findById).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toEqual(userMockData);
    });

    it('should return null when user does not exists', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      const user = await userResolver.getById(entityIdMockData);

      expect(userService.findById).toHaveBeenCalledWith(entityIdMockData);
      expect(user).toBe(null);
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValue(usersMockData);

      const users = await userResolver.getAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(users).toEqual(usersMockData);
    });
  });

  describe('getReminders', () => {
    it('should get all reminders of the user', async () => {
      jest.spyOn(reminderService, 'findUserReminders').mockResolvedValue(remindersMockData);
      const reminders = await userResolver.getReminders(userMockData);
      expect(reminderService.findUserReminders).toHaveBeenCalledWith(userMockData.id);
      expect(reminders).toEqual(remindersMockData);
    });
  });
});
