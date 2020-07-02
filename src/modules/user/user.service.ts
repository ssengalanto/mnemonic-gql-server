import { Injectable } from '@nestjs/common';

import { User } from '@shared/typeorm/entities';

import { UserRepository } from './user.repository';
import { UpdateUserInput } from './inputs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne(id);
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async update(id: string, payload: UpdateUserInput): Promise<User | undefined> {
    const user = await this.userRepository.updateOne(id, payload);
    return user;
  }

  async delete(id: string): Promise<User | undefined> {
    const user = await this.userRepository.deleteOne(id);
    return user;
  }
}
