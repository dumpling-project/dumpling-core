import { BODY_METADATA_KEY } from '../../../key/controller.metadata.key.ts';

export const Body = (): ParameterDecorator => {
  return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    if (propertyKey !== undefined) {
      const existingBodyParameters: { [key: number]: boolean } =
        Reflect.getMetadata(BODY_METADATA_KEY, target, propertyKey) || {};
      existingBodyParameters[parameterIndex] = true;
      Reflect.defineMetadata(BODY_METADATA_KEY, existingBodyParameters, target, propertyKey);
    }
  };
};
