import { QUERY_METADATA_KEY } from '../../../metadata/key/controller.metadata.key.ts';

export const Query = (parameterName?: string): ParameterDecorator => {
  return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    if (propertyKey !== undefined) {
      const existingParameters: { [key: number]: string } =
        Reflect.getMetadata(QUERY_METADATA_KEY, target, propertyKey) || {};
      existingParameters[parameterIndex] = parameterName || '';
      Reflect.defineMetadata(QUERY_METADATA_KEY, existingParameters, target, propertyKey);
    }
  };
};
