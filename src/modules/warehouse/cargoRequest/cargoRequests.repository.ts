import { Product } from 'src/entities/product/product.entity';
import { CargoRequest } from 'src/entities/warehouse/cargorequest.entity';
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
      (order as any).CreatedAt = 'DESC';
    }

    if (searchBy && searchKeyword) {
      filterCondition[searchBy] = Like(`%${searchKeyword}%`);
    }

    if (filterOptionsModel.order?.createdByAccountId) {
      const filterOptions = [
        { createdByAccountId: filterOrder.createdByAccountId }
      ];
      const modifiedOptions = filterOptions.map(condition => ({
        ...condition,
        ...filterCondition,
      }));
      where.push(...modifiedOptions);
    } else {
      where.push({ ...filterOrder, ...filterCondition });
    }
    let search = '';
    if (searchBy === 'userEmail') {
      search = `LOWER("Order__createdByCustomer"."email") like '%${searchKeyword.toLowerCase()}%'`;
      const options: FindManyOptions<CargoRequest> = {
        where: search,
        skip,
        take,
        order,
        relations: ['CreatedByAccount', 'Warehouse'],
      };
      const [orders, count] = await this.findAndCount(options);
      return [orders, count];
    }

    const options: FindManyOptions<CargoRequest> = {
      where,
      skip,
      take,
      order,
      relations: ['CreatedByAccount', 'Warehouse'],
    };

    const [orders, count] = await this.findAndCount(options);
    // const modifiedOrders = orders.map(o => new OrderResponseDto(o));

    // return [modifiedOrders, count];
    return [orders, count];
  }

  async getProductQuantities(orderId: number) {
    let quantities = [];
    const products = await Promise.all([
          getConnection().query(
            `SELECT *
                FROM "cargo_request_products__product" "c" WHERE "c"."cargoRequestId" = ${orderId};` ,
            [orderId],
          ),
    ]);
    products.map( product => quantities.push(product.quantity))
    return quantities;
  }
}
