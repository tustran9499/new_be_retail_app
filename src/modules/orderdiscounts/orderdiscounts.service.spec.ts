import { Test, TestingModule } from '@nestjs/testing';
import { OrderdiscountsService } from './orderdiscounts.service';

describe('OrderdiscountsService', () => {
  let service: OrderdiscountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderdiscountsService],
    }).compile();

    service = module.get<OrderdiscountsService>(OrderdiscountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
