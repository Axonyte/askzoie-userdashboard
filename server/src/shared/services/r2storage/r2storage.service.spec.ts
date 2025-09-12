import { Test, TestingModule } from '@nestjs/testing';
import { R2storageService } from './r2storage.service';

describe('R2storageService', () => {
  let service: R2storageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [R2storageService],
    }).compile();

    service = module.get<R2storageService>(R2storageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
