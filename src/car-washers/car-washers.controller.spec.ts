import { Test, TestingModule } from '@nestjs/testing';
import { CarWashersController } from './car-washers.controller';

describe('CarWashersController', () => {
  let controller: CarWashersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarWashersController],
    }).compile();

    controller = module.get<CarWashersController>(CarWashersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
