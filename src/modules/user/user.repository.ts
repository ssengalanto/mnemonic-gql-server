import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from '@shared/typeorm/entities';

import { CreateUserInput, UpdateUserInput } from './inputs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findById(id: string): Promise<User | null> {
    const user = await this.findOne(id);

    if (!user) return null;
    return user;
  }

  async createOne(payload: CreateUserInput): Promise<User> {
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

  async updateOne(id: string, payload: UpdateUserInput): Promise<User | null> {
    const result = await this.update(id, payload);

    if (result.affected === 0) {
      return null;
    }

    const user = await this.findById(id);
    return user;
  }

  async deleteOne(id: string): Promise<User | null> {
    const user = await this.findOne(id);

    if (!user) return null;

    await this.delete(id);
    return user;
  }
}
