import { Test, TestingModule } from '@nestjs/testing';
import { AdminconfigsController } from './adminconfigs.controller';
import { AdminconfigsService } from './adminconfigs.service';

describe('ConfigsController', () => {
  let controller: AdminconfigsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminconfigsController],
      providers: [AdminconfigsService],
    }).compile();

    controller = module.get<AdminconfigsController>(AdminconfigsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
