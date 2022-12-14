import { Config, ConfigValue } from './config/entities/config.entity';
import { compose, either, filter, isEmpty,equals,type, isNil, any,has, __,map,all,toLower, mapObjIndexed, mergeAll, not, pluck, prop, propEq, values, converge } from 'ramda';
import { Feature } from './feature/entities/feature.entity';

const isTypeBoolean = propEq('type', 'boolean');
const filterFeatures = filter(isTypeBoolean);
const filterConfig = filter(compose(not,isTypeBoolean));
const toEnvConfigMapList = compose(values,map(config => compose(mapObjIndexed((val,b,c) =>({[config.id]:val})),prop('value'))(config)));

export const toFeaturesMap = (env: string) => compose(mergeAll,pluck(env),toEnvConfigMapList, filterFeatures);

export const toConfigMap = (env: string) => compose(mergeAll,pluck(env),toEnvConfigMapList, filterConfig);

export const isNilOrEmpty = either(isNil, isEmpty);

export const isNotNullOrEmpty = compose(not, isNilOrEmpty);

export const toDotNotation = (nestedField: string) => compose(mergeAll,values,mapObjIndexed((val,key,o)=> ({[nestedField+'.'+key]: val})));

const isEqualType = (givenType: string) => compose(equals(givenType),toLower,type);
const isGivenTypesDoesNotMatchAll = (givenType: string, value: ConfigValue)=> compose(not,all(isEqualType(givenType)),values)(value)
export const isGivenTypeNotMatchesValuesType = converge(isGivenTypesDoesNotMatchAll,[prop('type'),prop('value')]);

export const hasPropertyFrom = (feature: Feature) => any(has(__,feature))