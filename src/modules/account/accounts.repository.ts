import { Account } from 'src/entities/account/account.entity';
import { Repository, EntityRepository, getConnection } from 'typeorm';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
    async getDeletedAccounts(findOptions: {
        take: number;
        skip: number;
        search: string;
      }): Promise<any> {
        const [accounts, count] = await Promise.all([
          getConnection().query(
            `SELECT "c"."*"
            FROM "Account" "c" WHERE "c"."DeletedAt" IS NOT NULL ${findOptions.search} ORDER BY "c"."Id" ASC LIMIT $1
            OFFSET $2`,
            [findOptions.take, findOptions.skip],
          ),
          getConnection().query(
            'SELECT COUNT(DISTINCT("c"."Id")) as "total" FROM "Account" "c" WHERE "c"."DeletedAt" IS NOT NULL',
          ),
        ]);
        return [accounts, count];
      }
}
