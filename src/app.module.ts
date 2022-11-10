import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
