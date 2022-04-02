import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Account } from 'src/account/account.entity';

import { Auth } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Save a hashed password and return an entity ID
   */
  async create(password: string) {
    const auth = this.authRepository.create({ password });
    await this.authRepository.save(auth);
    return auth.id;
  }

  /**
   * Convert a Account into a JWT token
   */
  getToken(account: Account) {
    return this.jwtService.sign({
      sub: account.id,
      username: account.data.name,
    });
  }
}
