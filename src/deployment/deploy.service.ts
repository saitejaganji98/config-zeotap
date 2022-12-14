import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { firestore } from 'firebase-admin';
import * as moment from 'moment';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { isNilOrEmpty } from 'src/helpers';
import { DeploymentRequestDto } from './dto/deploy-request.dto';
import { ArtifactResponse, Deploy, Features } from './entities/deploy.entity';
import DocumentSnapshot = firestore.DocumentSnapshot;
import QuerySnapshot = firestore.QuerySnapshot;

const JFROG_UNITY_CONFIG_URL = 'https://zeotap.jfrog.io/artifactory/generic-local/unity-config/'

@Injectable()
export class DeployService {
  private readonly logger = new Logger(DeployService.name);
  private deploymentsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
    constructor(@Inject(REQUEST) private readonly request: { user: any }, 
    private configService: ConfigService, private httpService: HttpService
  ) {
    this.deploymentsCollection = firestore().collection('deployments');
  }

  deployToArtifact(features: Features, env: string) {
    try {
      if (isNilOrEmpty(features) || !env) 
        throw new HttpException("data or env is missing", HttpStatus.BAD_REQUEST)
      const headers = {'X-JFrog-Art-Api': this.configService.get('JFROG_API_KEY')};
      const url = JFROG_UNITY_CONFIG_URL+ env+'/config.json'
      return this.httpService.put(url,features, {headers}).pipe(
        map(r => ({features, env})),
        catchError((e) => {
        this.logger.error(e);
        return of(e.response.data.errors[0])
      }));
    }
    catch(e) {
      throw new HttpException(e.message || e,HttpStatus.BAD_REQUEST)
    } 
  }


  addDeployment(artifactResponse: ArtifactResponse) {
    return from(this.deploymentsCollection.add({...artifactResponse, deployedBy: 'ppp', deployedAt: moment(new Date()).unix()}))
  }

  deploy(req: DeploymentRequestDto) {
    try {
      return this.deployToArtifact(req.features, req.env).pipe(
        switchMap((res: ArtifactResponse) => this.addDeployment(res)),
        map(_ => 'Deployed Successfully')
      );
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  // get list of latest 15 deployments

  getAllDeployments() {
    try {
      return from(this.deploymentsCollection.orderBy('deployedAt', 'desc').limit(15).get()).pipe(
        map((querySnapshot: QuerySnapshot<Deploy>) => {
          const deployments = querySnapshot.docs.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.data() }), {});
          return deployments;
        }));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  getDeployment(id: string) {
    try {
      return from(this.deploymentsCollection.doc(id).get()).pipe(
        map((docSnapshot: DocumentSnapshot<Deploy>) => {
          if (!docSnapshot.exists)
            throw new HttpException('Deployment: ' + id + ' not found', HttpStatus.NOT_FOUND);
          return docSnapshot.data()
        }));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  remove(id: string) {
    try {
      return from(this.deploymentsCollection.doc(id).delete()).pipe(map(_ => 'Deleted Successfully: ' + id));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }
}
