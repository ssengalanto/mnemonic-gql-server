import { Test, TestingModule } from '@nestjs/testing';

import { userMockData, createUserInputMockData } from '@modules/user/__mocks__';
import { appContextMockData } from '@shared/__mocks__';

import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { signinInputMockData, jwtMockToken } from '../__mocks__';

jest.mock('../auth.service.ts');

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthResolver, AuthService],
    }).compile();

    authResolver = await module.get<AuthResolver>(AuthResolver);
    authService = await module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      jest.spyOn(authService, 'signup').mockResolvedValue(userMockData);
      const user = await authResolver.signup(createUserInputMockData);
      expect(authService.signup).toHaveBeenCalledWith(createUserInputMockData);
      expect(user).toEqual(userMockData);
    });
  });

  describe('signin', () => {
    it('should signin a new user', async () => {
      jest.spyOn(authService, 'signin').mockResolvedValue(jwtMockToken);
      const accessToken = await authResolver.signin(signinInputMockData, appContextMockData);
      expect(authService.signin).toHaveBeenCalledWith(signinInputMockData, appContextMockData.res);
      expect(accessToken).toEqual(jwtMockToken);
    });
  });
});
