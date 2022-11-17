import { Module } from '@nestjs/common';
import { UnityConfigService } from './config.service';
import { ConfigController } from './config.controller';

@Module({
  controllers: [ConfigController],
  providers: [UnityConfigService]
})
export class UnityConfigModule {}
