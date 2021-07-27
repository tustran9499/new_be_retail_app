import { Test, TestingModule } from '@nestjs/testing';
import { StoreproductsController } from './storeproducts.controller';

describe('StoreproductsController', () => {
  let controller: StoreproductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreproductsController],
    }).compile();

    controller = module.get<StoreproductsController>(StoreproductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
