import { UnityConfigService } from '../config/config.service';
import { Module } from '@nestjs/common';
import { JfrogService } from './jfrog.service';
import { JfrogController } from './jfrog.controller';
import { HttpModule } from '@nestjs/axios';
import { FeatureService } from 'src/feature/feature.service';

@Module({
  imports: [HttpModule],
  controllers: [JfrogController],
  providers: [JfrogService, FeatureService]
})
export class JfrogModule {}
