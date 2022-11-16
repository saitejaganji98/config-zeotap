import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { firestore } from 'firebase-admin';
import { filter, from, map, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './../config/config.service';
import { isNotNullOrEmpty } from './../helpers';

@Injectable()
export class EnvService {
  private readonly logger = new Logger(EnvService.name);
  private fbCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  constructor(@Inject(REQUEST) private readonly request: { user: any }, private configService: ConfigService, private httpService: HttpService) {
    this.fbCollection = firestore().collection('config');
  }

  update(env: string) {
    return from(this.configService.getJsonForEnv(env)).pipe(
      // filter(data => isNotNullOrEmpty(data)),
      switchMap(data => {
        this.logger.log(data, 'my data')
        const url = 'https://zeotap.jfrog.io/artifactory/api/repositories/generic-local/unity-config/test/config.json';
        const headers = {'X-JFrog-Art-Api': 'AKCp8nHDzWsDyJUnknaT3nYECoTesPTZifznsVg8t5oNXDtfWRbapXJ9MNevXRVBxXQqunJEx', 'Content-Type': 'application/json'};
        return this.httpService.put(url,data, {headers}).pipe(map(r => r))
      }),
      map(res => {this.logger.log(res); return res.data.downloadUri}),
      catchError(e => of({error: e}))
      );
  }

  getEnvConfig(env: string ) {
    const url = 'https://zeotap.jfrog.io/artifactory/api/repositories/generic-local/unity-config/test/config.json';
    const headers = {'X-JFrog-Art-Api': 'AKCp8nHDzWsDyJUnknaT3nYECoTesPTZifznsVg8t5oNXDtfWRbapXJ9MNevXRVBxXQqunJEx','Accept': 'application/json', 'Content-Type': 'application/json'};
    this.logger.log({headers})
    return this.httpService.get(url, {headers}).pipe(map(res => res), catchError(e => of(e)))
  }
}
