import { REQUEST_METADATA_KEY } from '../../../metadata/key/controller.metadata.key.ts';

export const Req = (): ParameterDecorator => {
  return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    if (propertyKey !== undefined) {
      const existingParameters: { [key: number]: boolean } =
        Reflect.getMetadata(REQUEST_METADATA_KEY, target, propertyKey) || {};
      existingParameters[parameterIndex] = true;
      Reflect.defineMetadata(REQUEST_METADATA_KEY, existingParameters, target, propertyKey);
    }
  };
};
