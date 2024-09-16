import { Test, TestingModule } from '@nestjs/testing';
import { HeadersController } from './headers.controller';
import { HeadersService } from './headers.service';

describe('HeadersController', () => {
  let controller: HeadersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeadersController],
      providers: [HeadersService],
    }).compile();

    controller = module.get<HeadersController>(HeadersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
