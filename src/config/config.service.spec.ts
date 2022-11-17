import { Test, TestingModule } from '@nestjs/testing';
import { UnityConfigService } from './config.service';

describe('ConfigService', () => {
  let service: UnityConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnityConfigService],
    }).compile();

    service = module.get<UnityConfigService>(UnityConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
