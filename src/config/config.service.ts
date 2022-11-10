import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { firestore } from 'firebase-admin';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Config, CreateConfig, UpdateConfig } from './entities/config.entity';
import DocumentSnapshot = firestore.DocumentSnapshot;
import QuerySnapshot = firestore.QuerySnapshot;

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private fbCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  constructor(@Inject(REQUEST) private readonly request: { user: any }) {
    this.fbCollection = firestore().collection('config');
  }
  async create(createConfigDto: CreateConfigDto): Promise<CreateConfig> {
    const userId = this.request.user;
      const config: CreateConfig = {
        ...createConfigDto,
        // createdBy: userId,
        createdOn: new Date().toDateString()
      } 
      this.logger.log('Created config:', config);
      return this.fbCollection.doc(config.id).set(config).then(_ => config); 
    // throw new HttpException('body does not match the type', HttpStatus.BAD_REQUEST)
  }

  findAll() {
    return this.fbCollection.get().then((querySnapshot: QuerySnapshot<Config>) =>{
      this.logger.debug('COnfig collection:', querySnapshot.docs);
      const config = querySnapshot.docs.reduce((acc, curr) => ({...acc, [curr.id]: curr.data()}), {});
      return config;
    })
  }

  findOne(id: string) {
    return this.fbCollection.doc(id).get().then((docSnapshot: DocumentSnapshot<Config>) => docSnapshot.data());
  }

  async update(id: string, updateConfigDto: UpdateConfigDto): Promise<UpdateConfig> {
    const userId = this.request.user;
    const config = {
      ...updateConfigDto,
      // updatedBy: userId,
      updatedOn: new Date().toISOString()
    }
    this.logger.log('Updated config:', config);
    return this.fbCollection.doc(id).update(config).then(_ => config);
  }

  async remove(id: string) {
    this.logger.log('Deleted config:', id);
    return this.fbCollection.doc(id).delete().then(res => ('Deleted successfully - '+ id));
  }
}
