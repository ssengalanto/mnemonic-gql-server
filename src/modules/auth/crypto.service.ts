/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class CryptoService {
  async hash(
    data: any,
    saltOrRounds: string | number,
    callback?: ((err: Error, encrypted: string) => void) | undefined,
  ): Promise<string> {
    const response = await hash(data, saltOrRounds, callback);
    return response;
  }

  async verify(
    data: any,
    encrypted: string,
    callback?: ((err: Error, same: boolean) => void) | undefined,
  ): Promise<boolean> {
    const response = await compare(data, encrypted, callback);
    return response;
  }
}
