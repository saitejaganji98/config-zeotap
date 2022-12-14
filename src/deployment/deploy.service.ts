import { FeatureService } from 'src/feature/feature.service';
import { JfrogService } from '../jfrog/jfrog.service';
import { Feature } from '../feature/entities/feature.entity';
import { DeployRequestDto } from './dto/deploy-request.dto';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { firestore } from 'firebase-admin';
import * as moment from 'moment';
import { catchError, from, map, of, switchMap } from 'rxjs';
import DocumentSnapshot = firestore.DocumentSnapshot;
import QuerySnapshot = firestore.QuerySnapshot;
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ArtifactResponse, Deploy, Features } from './entities/deploy.entity';
import { isNilOrEmpty } from 'src/helpers';

const JFROG_UNITY_CONFIG_URL = 'https://zeotap.jfrog.io/artifactory/generic-local/unity-config/'

@Injectable()
export class DeployService {
  private readonly logger = new Logger(DeployService.name);
  private featuresCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  private deploymentsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
    constructor(@Inject(REQUEST) private readonly request: { user: any }, 
    private featureService: FeatureService,
    private configService: ConfigService, private httpService: HttpService
  ) {
    this.featuresCollection = firestore().collection('features');
    this.deploymentsCollection = firestore().collection('deployments');
  }

  deploy(deployRequestDto: DeployRequestDto) {
    try {
      const req = {
        ...deployRequestDto,
      }
      this.logger.debug('Request:', req);
      return from(this.featuresCollection.doc(req.featureKey).get()).pipe(
        map((docSnapshot: DocumentSnapshot<Feature>) => {
          if (!docSnapshot.exists)
            throw new HttpException('Feature: ' + req.featureKey + ' does not exist', HttpStatus.BAD_REQUEST);
        }),
        switchMap(_ => this.addConfig(req)),
        switchMap(_ => this.getEnvConfigAndDeployArtifact(req.env)),
        switchMap((res: ArtifactResponse) => this.addDeployment(res)),
        map(_ => 'Deployed Successfully')
      );
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  redeploy(id: string) {
    try {
      return from(this.deploymentsCollection.doc(id).get()).pipe(
        map((docSnapshot: DocumentSnapshot<Deploy>) => {
          if (!docSnapshot.exists)
            throw new HttpException('Deployment: ' + id + ' does not exist', HttpStatus.BAD_REQUEST);
          return docSnapshot.data();
        }),
        switchMap(res => this.deployToArtifact(res.data, res.env)),
        switchMap((res: ArtifactResponse) => this.addDeployment(res)),
        map(_ => 'Re-Deployed Successfully')
      );
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  getAllDeployments() {
    try {
      return from(this.deploymentsCollection.get()).pipe(
        map((querySnapshot: QuerySnapshot<Deploy>) => {
          const deployments = querySnapshot.docs.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.data() }), {});
          this.logger.debug('Deployments:', deployments);
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
    this.logger.debug('Deleted deployment:', id);
    try {
      return from(this.deploymentsCollection.doc(id).delete()).pipe(map(_ => 'Deleted Successfully: ' + id));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  addConfig(req) {
    return from(this.featuresCollection.doc(req.featureKey).collection(req.env).doc(req.featureKey).set({enabled: req.enabled, config: req.config ?? {}}));
  }
  addDeployment(artifactResponse: ArtifactResponse) {
    return from(this.deploymentsCollection.add({env: artifactResponse.env, data: artifactResponse.data, deployedBy: 'ppp', deployedAt: moment(new Date()).unix()}))
  }

  deployToArtifact(data: Features, env: string) {
    try {
      if (isNilOrEmpty(data) || !env) 
        throw new HttpException("data or env is missing", HttpStatus.BAD_REQUEST)
      const headers = {'X-JFrog-Art-Api': this.configService.get('JFROG_API_KEY')};
      const url = JFROG_UNITY_CONFIG_URL+ env+'/config.json'
      return this.httpService.put(url,data, {headers}).pipe(
        map(r => ({msg:'Successfully updated the file.', data, env})),
        catchError((e) => {
        this.logger.error(e);
        return of(e.response.data.errors[0])
      }));
    }
    catch(e) {
      throw new HttpException(e.message || e,HttpStatus.BAD_REQUEST)
    } 
  }

  getEnvConfigAndDeployArtifact(env: string) {
    try {
      return this.featureService.getFeaturesForEnv(env).pipe(
        switchMap((data: Features) => this.deployToArtifact(data, env)));
    } catch(e) {
      throw new HttpException(e.message || e,HttpStatus.BAD_REQUEST)
    }
  }
}
