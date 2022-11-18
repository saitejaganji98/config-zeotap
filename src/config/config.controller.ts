import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UnityConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: UnityConfigService) {}

  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {
    return this.configService.createConfig(createConfigDto);
  }

  @Get()
  findAll() {
    return this.configService.getAllConfig();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configService.getConfig(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigDto: UpdateConfigDto) {
    return this.configService.updateConfig(id, updateConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configService.removeConfig(id);
  }
}
