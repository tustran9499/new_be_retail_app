import { Test, TestingModule } from '@nestjs/testing';
import { CargoRequestsController } from './cargoRequests.controller';

describe('CargoRequestsController', () => {
  let controller: CargoRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CargoRequestsController],
    }).compile();

    controller = module.get<CargoRequestsController>(CargoRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
