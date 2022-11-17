import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { from, map, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UnityConfigService } from './../config/config.service';

@Injectable()
export class EnvService {
  private readonly logger = new Logger(EnvService.name);
  constructor(@Inject(REQUEST) private readonly request: { user: any }, private unityConfigService: UnityConfigService,private configService: ConfigService, private httpService: HttpService) {
  }

  update(env: string) {
    return from(this.unityConfigService.getJsonForEnv(env)).pipe(
      switchMap(data => {
        this.logger.log(data, 'my data')
        const url = 'https://zeotap.jfrog.io/artifactory/api/repositories/generic-local/unity-config/test/config.json';
        const headers = {'Authorization': this.configService.get('JFROG_ACCESS_TOKEN'),'Accept': 'application/json', 'Content-Type': 'application/json'};
        return this.httpService.put(url,data, {headers}).pipe(map(r => r))
      }),
      map(res => {this.logger.log(res); return res.data.downloadUri}),
      catchError(e => of({error: e}))
      );
  }

  getEnvConfig(env: string ) {
    const url2= 'https://unity-qa.zeotap.com/datamanager/api/v2/orgs/0/consent-config'
    const url = 'https://zeotap.jfrog.io/artifactory/api/repositories/generic-local/unity-config/test/config.json';
    const headers = {'Authorization': this.configService.get('JFROG_ACCESS_TOKEN'),'Accept': 'application/json', 'Content-Type': 'application/json'};
    return this.httpService.get(url, {headers: headers}).pipe(map(res => res.data), catchError(e => of(e)))
  }
}
