import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { firestore } from 'firebase-admin';
import * as moment from 'moment';
import { omit } from 'ramda';
import { from, map, Observable, switchMap } from 'rxjs';
import { hasPropertyFrom, isGivenTypeNotMatchesValuesType, toConfigMap, toDotNotation, toFeaturesMap } from './../helpers';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Config, ConfigValue, CreateConfig, UnityConfig } from './entities/config.entity';
import DocumentSnapshot = firestore.DocumentSnapshot;
import QuerySnapshot = firestore.QuerySnapshot;
@Injectable()
export class UnityConfigService {
  private readonly logger = new Logger(UnityConfigService.name);
  private fbCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  constructor(@Inject(REQUEST) private readonly request: { user: any }) {
    this.fbCollection = firestore().collection('config');
  }
  createConfig(createConfigDto: CreateConfigDto): Observable<CreateConfig> {
    try {
      const config: CreateConfig = {
        ...createConfigDto,
        type: createConfigDto.type.toLowerCase(),
        createdBy: 'ppp',
        createdOn: moment(new Date()).unix()
      }
      const notAllowedProps = ['updatedOn', 'updatedBy'];
      // const userId = this.request.user;
      if (isGivenTypeNotMatchesValuesType(config))
        throw new HttpException("Property: 'type' does not match with some of the types of values. Allowed types: number, string, boolean, array, object", HttpStatus.BAD_REQUEST)
      // if (hasPropertyFrom(config as Config)(notAllowedProps))
      //   throw new HttpException("Following properties cannot be added: " + notAllowedProps, HttpStatus.BAD_REQUEST);
      this.logger.debug('Created config:', config);
      return from(this.fbCollection.doc(config.id).get()).pipe(
        map((docSnapshot: DocumentSnapshot<Config>) => {
          if (docSnapshot.exists)
            throw new HttpException('Document: ' + config.id + ' already exists', HttpStatus.BAD_REQUEST);
        }),
        switchMap(_ => from(this.fbCollection.doc(config.id).set(config, { merge: true }))),
        map(_ => config)
      );
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  getAllConfig(): Observable<{ [id: string]: Config }> {
    try {
      return from(this.fbCollection.get()).pipe(
        map((querySnapshot: QuerySnapshot<Config>) => { this.logger.debug(querySnapshot,'ass')
          const config = querySnapshot.docs.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.data() }), {});
          this.logger.debug('Config collection:', config);
          return config;
        }));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  getConfig(id: string): Observable<Config> {
    try {
      return from(this.fbCollection.doc(id).get()).pipe(
        map((docSnapshot: DocumentSnapshot<Config>) => {
          if (!docSnapshot.exists)
            throw new HttpException('Document Id: ' + id + ' not found', HttpStatus.NOT_FOUND);
          return docSnapshot.data()
        }));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  updateConfig(id: string, updateConfigDto: UpdateConfigDto): Observable<string> {
    try {
      // const userId = this.request.user;
      const notAllowedProps = ["id", "type", "createdOn", "createdBy"]
      // if (hasPropertyFrom(updateConfigDto as Config)(notAllowedProps))
      //   throw new HttpException("Following properties cannot be added: " + notAllowedProps, HttpStatus.BAD_REQUEST);
      const dotNotationValue = toDotNotation('value')(updateConfigDto.value)
      const updateConfigDtoWithoutValue = omit(['value'], updateConfigDto);
      const config = {
        ...updateConfigDtoWithoutValue,
        ...dotNotationValue,
        updatedBy: 'ppp',
        updatedOn: moment(new Date()).unix() // firestore.FieldValue.serverTimestamp() - should use?
      }
      this.logger.debug('Updated config:', config);
      return from(this.fbCollection.doc(id).update(config)).pipe(map(_ => 'Updated Successfully: ' + id));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  removeConfig(id: string): Observable<string> {
    this.logger.debug('Deleted config:', id);
    try {
      return from(this.fbCollection.doc(id).delete()).pipe(map(_ => 'Deleted Successfully: ' + id));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  getJsonForEnv(env: string): Observable<UnityConfig> {
    try {
      return this.getAllConfig().pipe(map(allConfig => {
        const features: { [id: string]: boolean } = toFeaturesMap(env)(allConfig);
        const config: { [id: string]: ConfigValue } = toConfigMap(env)(allConfig);
        const envConfig = { features, config };
        this.logger.debug('Config from DB:', envConfig);
        return envConfig;
      }));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }
}
