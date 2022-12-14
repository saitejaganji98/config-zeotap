import { Controller, Get, HttpCode, Param, Put } from '@nestjs/common';
import { JfrogService } from './jfrog.service';

@Controller('jfrog')
export class JfrogController {
  constructor(private readonly envService: JfrogService) {}

  @Get(':env')
  get(@Param('env') env: string) {
    return this.envService.getEnvConfigFromJfrog(env);
  }
}
