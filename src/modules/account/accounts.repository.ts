import { Account } from 'src/entities/account/account.entity';
import { Repository, EntityRepository, getConnection } from 'typeorm';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  async getDeletedAccounts(findOptions: any): Promise<any> {
    const [accounts, count] = await Promise.all([
      getConnection().query(
        `SELECT *
            FROM "Account" "c" WHERE "c"."DeletedAt" IS NOT NULL ${
              findOptions.search
            } ORDER BY "c"."Id" ASC OFFSET ${parseInt(
          findOptions.skip,
        )} ROWS FETCH NEXT ${parseInt(findOptions.take)} ROWS ONLY;`,
        [parseInt(findOptions.take), parseInt(findOptions.skip)],
      ),
      getConnection().query(
        'SELECT COUNT(DISTINCT("c"."Id")) as "total" FROM "Account" "c" WHERE "c"."DeletedAt" IS NOT NULL',
      ),
    ]);
    return [accounts, count];
  }
}
