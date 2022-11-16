import { compose, either, filter, isEmpty, isNil, map, mapObjIndexed, mergeAll, not, pluck, prop, propEq, values } from 'ramda';

const isTypeBoolean = propEq('type', 'boolean');
const filterFeatures = filter(isTypeBoolean);
const filterConfig = filter(compose(not,isTypeBoolean));
const toEnvConfigMapList = compose(values,map(config => compose(mapObjIndexed((val,b,c) =>({[config.id]:val})),prop('value'))(config)));

export const toFeaturesMap = (env: string) => compose(mergeAll,pluck(env),toEnvConfigMapList, filterFeatures);

export const toConfigMap = (env: string) => compose(mergeAll,pluck(env),toEnvConfigMapList, filterConfig);

export const isNilOrEmpty = either(isNil, isEmpty);

export const isNotNullOrEmpty = compose(not, isNilOrEmpty);