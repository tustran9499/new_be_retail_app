import { Test, TestingModule } from '@nestjs/testing';
import { CargoRequestsService } from './cargoRequests.service';

describe('CargoRequestsService', () => {
  let service: CargoRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CargoRequestsService],
    }).compile();

    service = module.get<CargoRequestsService>(CargoRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
