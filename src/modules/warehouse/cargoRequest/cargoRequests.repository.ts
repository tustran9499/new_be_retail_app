import { CargoRequest } from './../../../entities/warehouse/cargorequest.entity';
import { Repository, EntityRepository, getConnection, Like, FindManyOptions } from 'typeorm';
import { FilterRequestDto } from './dto/filter-request.dto';

@EntityRepository(CargoRequest)
export class CargoRequestRepository extends Repository<CargoRequest> {
  // async getDeletedAccounts(findOptions: any): Promise<any> {
  //   const [accounts, count] = await Promise.all([
  //     getConnection().query(
  //       `SELECT *
  //           FROM "Account" "c" WHERE "c"."DeletedAt" IS NOT NULL ${
  //             findOptions.search
  //           } ORDER BY "c"."Id" ASC OFFSET ${parseInt(
  //         findOptions.skip,
  //       )} ROWS FETCH NEXT ${parseInt(findOptions.take)} ROWS ONLY;`,
  //       [parseInt(findOptions.take), parseInt(findOptions.skip)],
  //     ),
  //     getConnection().query(
  //       'SELECT COUNT(DISTINCT("c"."Id")) as "total" FROM "Account" "c" WHERE "c"."DeletedAt" IS NOT NULL',
  //     ),
  //   ]);
  //   return [accounts, count];
  // }

  async getList(
    filterOptionsModel: FilterRequestDto,
  ): Promise<[CargoRequest[], number]> {
    const {
      skip,
      take,
      searchBy,
      searchKeyword,
      order: filterOrder,
    } = filterOptionsModel;
    const order = {};
    const filterCondition = {} as any;
    const where = [];

    if (filterOptionsModel.orderBy) {
      order[filterOptionsModel.orderBy] = filterOptionsModel.orderDirection;
    } else {
      (order as any).createdDate = 'DESC';
    }

    if (searchBy && searchKeyword) {
      filterCondition[searchBy] = Like(`%${searchKeyword}%`);
    }

    
    where.push({ ...filterOrder, ...filterCondition });
    let search = '';
    // if (searchBy === 'customerEmail') {
    //   search = `LOWER("Order__createdByCustomer"."email") like '%${searchKeyword.toLowerCase()}%'`;
    //   const options: FindManyOptions<CargoRequest> = {
    //     where: search,
    //     skip,
    //     take,
    //     order,
    //     relations: ['tracking', 'createdByCustomer', 'owner'],
    //   };
    //   const [orders, count] = await this.findAndCount(options);
    //   return [orders, count];
    // }
    
}
