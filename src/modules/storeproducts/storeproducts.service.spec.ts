import { Test, TestingModule } from '@nestjs/testing';
import { StoreproductsService } from './storeproducts.service';

describe('StoreproductsService', () => {
  let service: StoreproductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreproductsService],
    }).compile();

    service = module.get<StoreproductsService>(StoreproductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
