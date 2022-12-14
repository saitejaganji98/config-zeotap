import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from "firebase-admin";
import { AuthModule } from './auth/auth.module';
import { UnityConfigModule } from './config/config.module';
import { DeployModule } from './deployment/deploy.module';
import { FeatureModule } from './feature/feature.module';
import { JfrogModule } from './jfrog/jfrog.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), UnityConfigModule,AuthModule, JfrogModule, FeatureModule, DeployModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    const serviceAccountUrl = this.configService.get('SERVICE_ACCOUNT_JSON');
    const serviceAccount = require(serviceAccountUrl)

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: this.configService.get('FIREBASE_DB_URL'),
    });
  }
}
