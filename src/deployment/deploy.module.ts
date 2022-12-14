import { FeatureService } from 'src/feature/feature.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DeployController } from './deploy.controller';
import { DeployService } from './deploy.service';

@Module({
  imports: [HttpModule],
  controllers: [DeployController],
  providers: [DeployService, FeatureService]
})
export class DeployModule {}
