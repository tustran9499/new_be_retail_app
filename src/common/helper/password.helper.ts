import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordHelper {
  saltRounds = 10;

  async createHash(plain: string): Promise<string> {
    return await bcrypt.hash(plain, this.saltRounds);
  }

  async checkHash(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }
}
