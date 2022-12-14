import { Feature } from './entities/feature.entity';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { from, map, switchMap } from 'rxjs';
import { hasPropertyFrom, isGivenTypeNotMatchesValuesType } from 'src/helpers';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { firestore } from 'firebase-admin';
import DocumentSnapshot = firestore.DocumentSnapshot;
import QuerySnapshot = firestore.QuerySnapshot;

@Injectable()
export class FeatureService {
  private readonly logger = new Logger(FeatureService.name);
  private fbCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  constructor(@Inject(REQUEST) private readonly request: { user: any }) {
    this.fbCollection = firestore().collection('features');
  }
  create(createFeatureDto: CreateFeatureDto) {
    try {
      const feature: CreateFeatureDto = {
        ...createFeatureDto,
      }
      this.logger.debug('Feature added:', feature);
      return from(this.fbCollection.doc(feature.featureKey).get()).pipe(
        map((docSnapshot: DocumentSnapshot<Feature>) => {
          if (docSnapshot.exists)
            throw new HttpException('Feature: ' + feature.featureKey + ' already exists', HttpStatus.BAD_REQUEST);
        }),
        switchMap(_ => from(this.fbCollection.doc(feature.featureKey).set(feature, { merge: true }))),
        map(_ => feature)
      );
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  findAll() {
    try {
      return from(this.fbCollection.get()).pipe(
        map((querySnapshot: QuerySnapshot<Feature>) => {
          const features = querySnapshot.docs.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.data() }), {});
          this.logger.debug('Features:', features);
          return features;
        }));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  findOne(featureKey: string) {
    try {
      return from(this.fbCollection.doc(featureKey).get()).pipe(
        map((docSnapshot: DocumentSnapshot<Feature>) => {
          if (!docSnapshot.exists)
            throw new HttpException('Feature: ' + featureKey + ' not found', HttpStatus.NOT_FOUND);
          return docSnapshot.data()
        }));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  update(featureKey: string, updateFeatureDto: UpdateFeatureDto) {
    try {
      const notAllowedProps = ["featureKey"]
      if (hasPropertyFrom(updateFeatureDto as Feature)(notAllowedProps))
        throw new HttpException("Following properties cannot be updated: " + notAllowedProps, HttpStatus.BAD_REQUEST);
      const updatedFeature = updateFeatureDto;
      this.logger.debug('Updated feature:', updatedFeature);
      return from(this.fbCollection.doc(featureKey).update(updatedFeature)).pipe(map(_ => 'Updated Successfully: ' + featureKey));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  remove(featureKey: string) {
    this.logger.debug('Deleted feature:', featureKey);
    try {
      return from(this.fbCollection.doc(featureKey).delete()).pipe(map(_ => 'Deleted Successfully: ' + featureKey));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }

  getFeaturesForEnv(env: string) {
    try {
      if (!env)
        throw new HttpException('env is missing', HttpStatus.BAD_REQUEST);
      return from(firestore().collectionGroup(env).get()).pipe(
        map((querySnapshot) => {
          const features = querySnapshot.docs.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.data() }), {});
          this.logger.debug('Features:', features);
          return features;
        }));
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST)
    }
  }
}
