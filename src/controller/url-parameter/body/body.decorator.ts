import { BODY_METADATA_KEY } from '../../../metadata/key/controller.metadata.key.ts';
import { MethodParameterMetadataType } from '../../../metadata/type/controller.metadata.type.ts';
import { MetadataContainer } from '../../../metadata/metadata.container.ts';
import { ConstructorFunction } from '../../../di/dumpling.container.ts';

export const Body = (): ParameterDecorator => {
  return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    if (propertyKey !== undefined) {
      const existingBodyParameters: MethodParameterMetadataType =
        MetadataContainer.getMethodMetadata(
          target.constructor as ConstructorFunction,
          propertyKey,
          BODY_METADATA_KEY,
        ) || {};

      existingBodyParameters[parameterIndex] = true;

      MetadataContainer.setMethodMetadata<MethodParameterMetadataType>(
        target.constructor as ConstructorFunction,
        propertyKey,
        BODY_METADATA_KEY,
        existingBodyParameters,
      );
    }
  };
};
