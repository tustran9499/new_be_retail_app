import { Test, TestingModule } from '@nestjs/testing';
import { ProductdiscountsService } from './productdiscounts.service';

describe('ProductdiscountsService', () => {
  let service: ProductdiscountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductdiscountsService],
    }).compile();

    service = module.get<ProductdiscountsService>(ProductdiscountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
