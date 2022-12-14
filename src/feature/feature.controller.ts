import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  addFeature(@Body() createFeatureDto: CreateFeatureDto) {
    return this.featureService.addFeature(createFeatureDto);
  }

  @Get()
  getAllFeatures() {
    return this.featureService.getAllFeatures();
  }

  @Get(':id')
  getFeature(@Param('id') id: string) {
    return this.featureService.getFeature(id);
  }

  @Patch(':id')
  updateFeature(@Param('id') id: string, @Body() updateFeatureDto: UpdateFeatureDto) {
    return this.featureService.updateFeature(id, updateFeatureDto);
  }

  @Delete(':id')
  removeFeature(@Param('id') id: string) {
    return this.featureService.removeFeature(id);
  }
}
