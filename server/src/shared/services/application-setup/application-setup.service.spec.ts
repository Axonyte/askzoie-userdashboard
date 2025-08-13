import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationSetupService } from './application-setup.service';

describe('ApplicationSetupService', () => {
  let service: ApplicationSetupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationSetupService],
    }).compile();

    service = module.get<ApplicationSetupService>(ApplicationSetupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
