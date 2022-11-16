import { Controller, Get, Param, Put } from '@nestjs/common';
import { EnvService } from './env.service';

@Controller('env')
export class EnvController {
  constructor(private readonly envService: EnvService) {}

  @Put(':env')
  update(@Param('env') env: string) {
    return this.envService.update(env);
  }

  @Get(':env')
  get(@Param('env') env: string) {
    return this.envService.getEnvConfig(env);
  }
}
