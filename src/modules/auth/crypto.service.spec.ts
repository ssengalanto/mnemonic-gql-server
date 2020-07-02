import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';

import { CryptoService } from './crypto.service';
import { Constant } from '@shared/enums';

jest.mock('bcrypt');

describe('CryptoService', () => {
  let cryptoService: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    cryptoService = await module.get<CryptoService>(CryptoService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(cryptoService).toBeDefined();
  });

  describe('hash', () => {
    it('it should hash the provided value', async () => {
      const hashed = 'hashed-value';
      const value = 'to-hash-value';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashed);

      const result = await cryptoService.hash(value, Constant.SALT);

      expect(bcrypt.hash).toHaveBeenCalledWith(value, Constant.SALT, undefined);
      expect(result).toEqual(hashed);
    });
  });

  describe('verify', () => {
    it('it should verify the hashed and return a boolean value depeding on the result', async () => {
      const hashed = 'hashed-value';
      const value = 'to-hash-value';
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await cryptoService.verify(value, hashed);

      expect(bcrypt.compare).toHaveBeenCalledWith(value, hashed, undefined);
      expect(result).toBe(true);
    });
  });
});
