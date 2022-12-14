import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FeatureService } from 'src/feature/feature.service';
import { JfrogController } from './jfrog.controller';
import { JfrogService } from './jfrog.service';

@Module({
  imports: [HttpModule],
  controllers: [JfrogController],
  providers: [JfrogService, FeatureService]
})
export class JfrogModule {}
