import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { from, map, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UnityConfigService } from './../config/config.service';

@Injectable()
export class EnvService {
  private readonly logger = new Logger(EnvService.name);
  constructor(@Inject(REQUEST) private readonly request: { user: any }, private configService: UnityConfigService, private httpService: HttpService) {
  }

  update(env: string) {
    return from(this.configService.getJsonForEnv(env)).pipe(
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
    const url2= 'https://unity-qa.zeotap.com/datamanager/api/v2/orgs/0/consent-config'
    const headers2 = {'Authorization': 'Bearer eyJraWQiOiJKa19ncTcwQnZVcUJjcUZENjZ1VldyaVdyUlJTMGRnRlE0MElWZGNvMnhNIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULm9KWmYtUXhPWGVTWkpvek9oTDlTdDZpTXZqSXA5aU52T2QyWTZZQmRXdDQub2FyNHE3N3AxTGlHMGZtVkoweDYiLCJpc3MiOiJodHRwczovL2xvZ2luLXN0YWdpbmcuemVvdGFwLmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6IjBvYTFqNDVtbGFnQ1g1Y1B6MHg3IiwiaWF0IjoxNjY4NjcwODIzLCJleHAiOjE2Njg2NzQ0MjMsImNpZCI6IjBvYTFqNDVtbGFnQ1g1Y1B6MHg3IiwidWlkIjoiMDB1MWp6NnhraE5OeUNvUGwweDciLCJzY3AiOlsicHJvZmlsZSIsIm9mZmxpbmVfYWNjZXNzIiwib3BlbmlkIiwiZW1haWwiXSwiYXV0aF90aW1lIjoxNjY4NjAzODg5LCJzdWIiOiJzYWl0ZWphLmdhbmppQHplb3RhcC5jb20iLCJsYXN0TmFtZSI6IkdhbmppIiwiZmlyc3ROYW1lIjoiU2FpdGVqYSIsImdyb3VwcyI6WyJhbmFseXRpY3NfZGVzaWduZXJfYWxsIl0sImVtYWlsIjoic2FpdGVqYS5nYW5qaUB6ZW90YXAuY29tIn0.nfKlVfkg3kJ--D7Hkle-IsvVn6E40F8mG2h7RA5zXSpzy7yR6593jSbCNBDMqbOdBL9UosCL-agT8QJF4aPnvp2tPkbQ29wof2hnktkrF6FyUIX1TvpYY6yo1-LVQhdgGqPgLaoOUJZI2m8_GokGDCU9FaE4pBkqxj4EFfID1bgYuhLOmCFq9LtZiYO8aXzo4yhu_ZPBwS5D0UsFUX5ayL1IS6uqeq4HLi4pDlSJyMyMwW6dKstEoLvMDeHh1isyaRr4ABZ0QxcTn1URhWFzub5wX7AI1OUuns8rLWJY32l9RRI9EgnMHW4osK6fYfdtjlTy7u6lI4EyZJ7A78R6-Q'}
    const url = 'https://zeotap.jfrog.io/artifactory/api/repositories/generic-local/unity-config/test/config.json';
    const headers = {'Authorization': 'Bearer eyJ2ZXIiOiIyIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYiLCJraWQiOiJEc3dZRVFUd2UzdEJTVFdqRFZxVGItVUI5SGlScFF2RFB0U3BfVzZuR0cwIn0.eyJleHQiOiJ7XCJyZXZvY2FibGVcIjpcInRydWVcIn0iLCJzdWIiOiJqZmFjQDAxZTJ3bjNtemFtNWV5MHdlbjVmd2IweWRqXC91c2Vyc1wvc2FpdGVqYS5nYW5qaUB6ZW90YXAuY29tIiwic2NwIjoiYXBwbGllZC1wZXJtaXNzaW9uc1wvYWRtaW4iLCJhdWQiOlsiamZydEAqIiwiamZhY0AqIiwiamZldnRAKiIsImpmbWRAKiIsImpmY29uQCoiXSwiaXNzIjoiamZmZUAwMDAiLCJleHAiOjE2Njg3NTY0NzcsImlhdCI6MTY2ODY3MDA3NywianRpIjoiZWFlZDA2NGUtYzg0Yi00NWQ2LWFhZWItOGUyYTI1Mzg4NGJhIn0.Rt0OzIZhR-DyVFJ_QKuCkqInKp-1VGTYcJSut3bJMETlbMuKqb7VXuHE4Gy8i9Dnejz-bolnShyFXmDgC1DS7FVaiZcLkPoeZ5dqRc8TSxA0zfnLAcbh-L35AjwYCS2_HgItMze67TPjkHZJLLOAQYvwPKkUZpgbndn4qdXTB7vmUcmc_Y1dpRmQcEFZOw9fbyvQgjREYwXH9_bXXrCcdgAdcNpbuJ_mYp45059I6r25lxmyxlAIzjU1sWwzl_cvqsYAnG1ubfklJ0xZyFXj-TWM_0JxcbBbv3ery2yFYHc0jR5lCY3pdaaJXS4HWPAsKvong9MYA_uQbXrDRcQJwg','Accept': 'application/json', 'Content-Type': 'application/json'};
    return this.httpService.get(url, {headers: headers}).pipe(map(res => res.data), catchError(e => of(e)))
  }
}
