import { Test, TestingModule } from '@nestjs/testing';
import { ProductdiscountsController } from './productdiscounts.controller';

describe('ProductdiscountsController', () => {
  let controller: ProductdiscountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductdiscountsController],
    }).compile();

    controller = module.get<ProductdiscountsController>(ProductdiscountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
