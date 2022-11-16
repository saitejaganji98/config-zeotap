import { UnityConfigModule } from './config/config.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EnvModule } from './env/env.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), UnityConfigModule,AuthModule, EnvModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
