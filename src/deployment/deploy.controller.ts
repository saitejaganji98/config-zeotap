import { DeployRequestDto } from './dto/deploy-request.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeployService } from './deploy.service';

@Controller('deployment')

export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @Post('/deploy')
  deploy(@Body() deployRequestDto: DeployRequestDto) {
    return this.deployService.deploy(deployRequestDto);
  }

  @Post('/redeploy/:id')
  redeploy(@Param('id') id: string) {
    return this.deployService.redeploy(id);
  }

  @Get()
  findAll() {
    return this.deployService.getAllDeployments();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deployService.getDeployment(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deployService.remove(id);
  }
}
