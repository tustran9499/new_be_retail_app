import { Account } from 'src/entities/account/account.entity';
import { Repository, EntityRepository, getConnection } from 'typeorm';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {}
