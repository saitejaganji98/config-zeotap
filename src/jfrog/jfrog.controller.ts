import { Controller, Get, HttpCode, Param, Put } from '@nestjs/common';
import { JfrogService } from './jfrog.service';

@Controller('jfrog')
export class JfrogController {
  constructor(private readonly envService: JfrogService) {}

  @Put(':env')
  @HttpCode(200)
  update(@Param('env') env: string) {
    return this.envService.getEnvConfigAndDeployArtifact(env);
  }

  @Get(':env')
  get(@Param('env') env: string) {
    return this.envService.getEnvConfigFromJfrog(env);
  }
}
