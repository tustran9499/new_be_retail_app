import { Test, TestingModule } from '@nestjs/testing';
import { OrderdiscountsController } from './orderdiscounts.controller';

describe('OrderdiscountsController', () => {
  let controller: OrderdiscountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderdiscountsController],
    }).compile();

    controller = module.get<OrderdiscountsController>(OrderdiscountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
