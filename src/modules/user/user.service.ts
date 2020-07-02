import { Injectable } from '@nestjs/common';

import { User } from '@shared/typeorm/entities';

import { UserRepository } from './user.repository';

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
}
