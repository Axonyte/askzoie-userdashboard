import { Test, TestingModule } from '@nestjs/testing';
import { AllowedDomainsService } from './allowed-domains.service';

describe('AllowedDomainsService', () => {
  let service: AllowedDomainsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllowedDomainsService],
    }).compile();

    service = module.get<AllowedDomainsService>(AllowedDomainsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
