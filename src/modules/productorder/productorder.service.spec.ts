import { Test, TestingModule } from '@nestjs/testing';
import { ProductorderService } from './productorder.service';

describe('ProductorderService', () => {
  let service: ProductorderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductorderService],
    }).compile();

    service = module.get<ProductorderService>(ProductorderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
