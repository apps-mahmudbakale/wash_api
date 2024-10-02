import { Test, TestingModule } from '@nestjs/testing';
import { CarWashersService } from './car-washers.service';

describe('CarWashersService', () => {
  let service: CarWashersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarWashersService],
    }).compile();

    service = module.get<CarWashersService>(CarWashersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
