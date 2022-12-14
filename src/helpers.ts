import { any, compose, either, has, isEmpty, isNil, mapObjIndexed, mergeAll, not, values, __ } from 'ramda';
import { Feature } from './feature/entities/feature.entity';

export const isNilOrEmpty = either(isNil, isEmpty);

export const isNotNullOrEmpty = compose(not, isNilOrEmpty);

export const toDotNotation = (nestedField: string) => compose(mergeAll,values,mapObjIndexed((val,key,o)=> ({[nestedField+'.'+key]: val})));

export const hasPropertyFrom = (feature: Feature) => any(has(__,feature))