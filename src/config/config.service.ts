import { toConfigMap, toFeaturesMap } from './../helpers';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { firestore } from 'firebase-admin';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Config, CreateConfig, UpdateConfig, ConfigValue } from './entities/config.entity';
import * as moment from 'moment';
import DocumentSnapshot = firestore.DocumentSnapshot;
import QuerySnapshot = firestore.QuerySnapshot;

@Injectable()
export class UnityConfigService {
  private readonly logger = new Logger(UnityConfigService.name);
  private fbCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  constructor(@Inject(REQUEST) private readonly request: { user: any }) {
    this.fbCollection = firestore().collection('config');
  }
  createConfig(createConfigDto: CreateConfigDto): Promise<CreateConfig> {
    // const userId = this.request.user;
      const config: CreateConfig = {
        ...createConfigDto,
        createdBy: 'ppp',
        createdOn: moment(new Date()).unix()
      } 
      this.logger.log('Created config:', config);
      return this.fbCollection.doc(config.id).set(config).then(_ => config); 
    // throw new HttpException('body does not match the type', HttpStatus.BAD_REQUEST)
  }

  getAllConfig(): Promise<{[id: string]: Config}> {
    return this.fbCollection.get().then((querySnapshot: QuerySnapshot<Config>) =>{
      const config = querySnapshot.docs.reduce((acc, curr) => ({...acc, [curr.id]: curr.data()}), {});
      this.logger.debug('COnfig collection:', config);
      return config;
    })
  }

  getConfig(id: string): Promise<Config> {
    return this.fbCollection.doc(id).get().then((docSnapshot: DocumentSnapshot<Config>) => docSnapshot.data());
  }

  updateConfig(id: string, updateConfigDto: UpdateConfigDto): Promise<UpdateConfig> {
    // const userId = this.request.user;
    const config = {
      ...updateConfigDto,
      updatedBy: 'ppp',
      updatedOn: moment(new Date()).unix()
    }
    this.logger.log('Updated config:', config);
    return this.fbCollection.doc(id).update(config).then(_ => config);
  }

  removeConfig(id: string) {
    this.logger.log('Deleted config:', id);
    return this.fbCollection.doc(id).delete().then(res => ('Deleted successfully - '+ id));
  }

  getJsonForEnv(env: string): Promise<{features: {[id: string]: boolean}; config: {[id: string] : ConfigValue}}> {
    return this.getAllConfig().then(allConfig => {
      const features:{[id: string]: boolean} = toFeaturesMap(env)(allConfig);
      const config:{[id: string] : ConfigValue} = toConfigMap(env)(allConfig);
      const envConfig = {features, config};
      this.logger.log(envConfig,'env config');
      return envConfig;
    });
  }
}
