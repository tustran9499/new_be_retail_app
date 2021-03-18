import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountsRepository: Repository<Account>,
    ) { }

    findAll(): Promise<Account[]> {
        return this.accountsRepository.find();
    }

    async findOne(username: string): Promise<Account | undefined> {
        return this.accountsRepository.findOne({ UserName: username });
    }
}
