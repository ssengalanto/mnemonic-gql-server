import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from '@shared/typeorm/entities';

import { CreateUserInput, UpdateUserInput } from './inputs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(payload: CreateUserInput): Promise<User> {
    try {
      const user = this.create(payload);

      await this.save(user);
      return user;
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async updateUser(id: string, payload: UpdateUserInput): Promise<User | undefined> {
    const result = await this.update(id, payload);

    if (result.affected === 0) {
      return undefined;
    }

    const user = await this.findOne(id);

    return user;
  }
}
