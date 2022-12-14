import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { DeploymentRequestDto } from './dto/deploy-request.dto';

@Controller('deployment')

export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @Post()
  deploy(@Body() deployRequestDto: DeploymentRequestDto) {
    try {
      const json = JSON.parse(JSON.stringify(deployRequestDto))
      return this.deployService.deploy(json);
    }
    catch(e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
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
