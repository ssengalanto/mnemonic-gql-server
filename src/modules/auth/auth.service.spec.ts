import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Cookie, Constant, COOKIE_OPTIONS } from '@shared/enums';
import { appContextMockData } from '@shared/__mocks__';
import { CreateUserInput } from '@modules/user/inputs';
import { UserRepository } from '@modules/user/user.repository';
import { userMockData, createUserInputMockData } from '@modules/user/__mocks__';

import { AuthService } from './auth.service';
import { CryptoService } from './crypto.service';
import { jwtMockToken, signinInputMockData, jwtPayloadMockData } from './__mocks__';
import { JwtPayload } from './interfaces';

jest.mock('./crypto.service');
jest.mock('@modules/user/user.repository.ts');

const mockJwtService = (): Partial<JwtService> => ({
  sign: jest.fn(),
  verify: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let cryptoService: CryptoService;
  let userRepository: UserRepository;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserRepository,
        CryptoService,
        ConfigService,
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
    cryptoService = await module.get<CryptoService>(CryptoService);
    jwtService = await module.get<JwtService>(JwtService);
    userRepository = await module.get<UserRepository>(UserRepository);
    configService = await module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(cryptoService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('signup', () => {
    it('should signup a user', async () => {
      const hashed = 'hashed-string';
      jest.spyOn(cryptoService, 'hash').mockResolvedValue(hashed);
      jest.spyOn(userRepository, 'createOne').mockResolvedValue(userMockData);
      jest.spyOn(authService, 'createAccessToken').mockReturnValue(jwtMockToken);
      jest.spyOn(authService, 'createRefreshToken').mockReturnValue(jwtMockToken);
      jest.spyOn(appContextMockData.res, 'cookie').mockImplementation();

      const accessToken = await authService.signup(createUserInputMockData, appContextMockData.res);

      const jwtPayload = {
        sub: userMockData.id,
        email: userMockData.email,
        first_name: userMockData.first_name,
        last_name: userMockData.last_name,
      };

      expect(cryptoService.hash).toHaveBeenCalledWith(
        createUserInputMockData.password,
        Constant.SALT,
      );
      expect(userRepository.createOne).toHaveBeenCalledWith({
        email: createUserInputMockData.email,
        password: hashed,
        first_name: createUserInputMockData.first_name,
        last_name: createUserInputMockData.last_name,
        active: true,
      } as CreateUserInput);

      expect(authService.createAccessToken).toHaveBeenCalledWith(jwtPayload);
      expect(authService.createRefreshToken).toHaveBeenCalledWith(jwtPayload);
      expect(appContextMockData.res.cookie).toHaveBeenCalledWith(
        Cookie.REFRESH_TOKEN,
        jwtMockToken,
        COOKIE_OPTIONS,
      );

      expect(accessToken).toEqual(jwtMockToken);
    });
  });

  describe('signin', () => {
    it('should signin a user', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(jwtPayloadMockData);
      jest.spyOn(authService, 'createAccessToken').mockReturnValue(jwtMockToken);
      jest.spyOn(authService, 'createRefreshToken').mockReturnValue(jwtMockToken);
      jest.spyOn(appContextMockData.res, 'cookie').mockImplementation();

      const accessToken = await authService.signin(signinInputMockData, appContextMockData.res);

      expect(authService.validateUser).toHaveBeenCalledWith(signinInputMockData);
      expect(authService.createAccessToken).toHaveBeenCalledWith(jwtPayloadMockData);
      expect(authService.createRefreshToken).toHaveBeenCalledWith(jwtPayloadMockData);

      expect(appContextMockData.res.cookie).toHaveBeenCalledWith(
        Cookie.REFRESH_TOKEN,
        jwtMockToken,
        COOKIE_OPTIONS,
      );
      expect(accessToken).toEqual(jwtMockToken);
    });

    it('should throw UnauthorizedException when jwtPayload is null', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);
      jest.spyOn(authService, 'createAccessToken').mockImplementation();
      jest.spyOn(authService, 'createRefreshToken').mockImplementation();
      jest.spyOn(appContextMockData.res, 'cookie').mockImplementation();

      try {
        await authService.signin(signinInputMockData, appContextMockData.res);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(authService.createAccessToken).not.toHaveBeenCalled();
        expect(authService.createRefreshToken).not.toHaveBeenCalled();
        expect(appContextMockData.res.cookie).not.toHaveBeenCalled();
      }
    });
  });

  describe('validateUser', () => {
    it('should validate a user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMockData);
      jest.spyOn(cryptoService, 'verify').mockResolvedValue(true);

      const jwtPayload = await authService.validateUser(signinInputMockData);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: signinInputMockData.email },
      });

      expect(cryptoService.verify).toHaveBeenCalledWith(
        signinInputMockData.password,
        userMockData.password,
      );

      expect(jwtPayload).toEqual({
        sub: userMockData.id,
        email: userMockData.email,
        first_name: userMockData.first_name,
        last_name: userMockData.last_name,
      } as JwtPayload);
    });

    it('should return null when user does not exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      const jwtPayload = await authService.validateUser(signinInputMockData);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: signinInputMockData.email },
      });
      expect(cryptoService.verify).not.toHaveBeenCalled();
      expect(jwtPayload).toBe(null);
    });
  });

  it('should return null when password is invalid', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMockData);
    jest.spyOn(cryptoService, 'verify').mockResolvedValue(false);

    const jwtPayload = await authService.validateUser(signinInputMockData);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: signinInputMockData.email },
    });
    expect(cryptoService.verify).toHaveBeenCalledWith(
      signinInputMockData.password,
      userMockData.password,
    );
    expect(jwtPayload).toBe(null);
  });

  describe('createAccessToken', () => {
    it('should create an access token', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue(jwtMockToken);

      const token = await authService.createAccessToken(jwtPayloadMockData);

      expect(jwtService.sign).toHaveBeenCalledWith(jwtPayloadMockData);
      expect(token).toEqual(jwtMockToken);
    });
  });

  describe('createRefreshToken', () => {
    it('should create a refresh token', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue(jwtMockToken);
      jest.spyOn(configService, 'get').mockReturnValue(86400);

      const token = await authService.createRefreshToken(jwtPayloadMockData);

      expect(jwtService.sign).toHaveBeenCalledWith(jwtPayloadMockData, {
        expiresIn: 86400,
      });
      expect(configService.get).toHaveBeenCalledWith('REFRESH_JWT_EXPIRES_IN');
      expect(token).toEqual(jwtMockToken);
    });
  });

  describe('validateTokenExpiry', () => {
    it('should return true when refreshToken is not yet expired', async () => {
      const oneDayAhead = new Date().getTime() + 1000 * 60 * 60 * 24;
      const exp = new Date(oneDayAhead).getTime() / 1000;
      jest.spyOn(jwtService, 'verify').mockReturnValue({ ...jwtPayloadMockData, exp });
      const result = await authService.validateTokenExpiry(jwtMockToken);

      expect(jwtService.verify).toHaveBeenCalledWith(jwtMockToken, {
        ignoreExpiration: true,
      });
      expect(result).toBe(true);
    });

    it('should return false when refreshToken is already expired', async () => {
      const overdue = new Date().getTime() - 1000 * 60 * 60 * 24;
      const exp = new Date(overdue).getTime() / 1000;
      jest.spyOn(jwtService, 'verify').mockReturnValue({ ...jwtPayloadMockData, exp });
      const result = await authService.validateTokenExpiry(jwtMockToken);

      expect(jwtService.verify).toHaveBeenCalledWith(jwtMockToken, {
        ignoreExpiration: true,
      });
      expect(result).toBe(false);
    });
  });
});
