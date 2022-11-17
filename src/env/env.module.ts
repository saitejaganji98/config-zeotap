import { UnityConfigService } from './../config/config.service';
import { Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { EnvController } from './env.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [EnvController],
  providers: [EnvService, UnityConfigService]
})
export class EnvModule {}
