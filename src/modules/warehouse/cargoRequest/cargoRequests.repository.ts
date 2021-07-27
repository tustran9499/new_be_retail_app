import { Product } from 'src/entities/product/product.entity';
import { CargoRequest } from 'src/entities/warehouse/cargorequest.entity';
import {
  Repository,
  EntityRepository,
  getConnection,
  Like,
  FindManyOptions,
} from 'typeorm';
import { FilterRequestDto } from './dto/filter-request.dto';

@EntityRepository(CargoRequest)
export class CargoRequestRepository extends Repository<CargoRequest> {}
