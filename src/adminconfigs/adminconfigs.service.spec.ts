import { Test, TestingModule } from '@nestjs/testing';
import { AdminconfigsService } from './adminconfigs.service';

describe('AdminconfigsService', () => {
  let service: AdminconfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminconfigsService],
    }).compile();

    service = module.get<AdminconfigsService>(AdminconfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
