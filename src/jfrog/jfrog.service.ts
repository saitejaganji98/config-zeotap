import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeatureService } from './../feature/feature.service';

const JFROG_UNITY_CONFIG_URL = 'https://zeotap.jfrog.io/artifactory/generic-local/unity-config/'
@Injectable()
export class JfrogService {
  private readonly logger = new Logger(JfrogService.name);
  constructor(private featureService: FeatureService,private configService: ConfigService, private httpService: HttpService) {
  }

  getEnvConfigFromJfrog(env: string ) {
    try {
      const headers = {'X-JFrog-Art-Api': this.configService.get('JFROG_API_KEY')};
      const url = JFROG_UNITY_CONFIG_URL+ env+'/config.json'
      return this.httpService.get(url, {headers: headers}).pipe(map(res => res.data), 
      catchError((e) => {
        this.logger.error(e);
        return of(e.response.data.errors[0])
      }));
    } catch(e) {
      throw new HttpException(e.message || e,HttpStatus.BAD_REQUEST)
    }
  }
}
