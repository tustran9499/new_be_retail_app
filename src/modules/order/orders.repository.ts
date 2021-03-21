import { Order } from 'src/entities/order/order.entity';
import { Repository, EntityRepository, getConnection } from 'typeorm';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
}
