import DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';

import { User } from '@shared/typeorm/entities';
import { NestDataLoader } from '@shared/interfaces';

import { UserService } from '../user.service';

@Injectable()
export class UserLoader implements NestDataLoader<string, User> {
  constructor(private readonly userService: UserService) {}

  generateDataLoader(): DataLoader<string, User> {
    return new DataLoader<string, User>((keys: readonly string[]) =>
      this.userService.findByIds(keys as string[]),
    );
  }
}
