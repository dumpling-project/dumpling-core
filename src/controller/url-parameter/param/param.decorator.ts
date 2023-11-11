import { PARAM_METADATA_KEY } from '../../../key/controller.metadata.key.ts';

export const Param = (parameterName: string): ParameterDecorator => {
  return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    if (propertyKey !== undefined) {
      const existingParameters: {
        [key: number]: string;
      } = Reflect.getMetadata(PARAM_METADATA_KEY, target, propertyKey) || {};

      existingParameters[parameterIndex] = parameterName;

      Reflect.defineMetadata(PARAM_METADATA_KEY, existingParameters, target, propertyKey);
    }
  };
};
