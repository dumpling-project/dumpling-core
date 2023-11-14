import { QUERY_METADATA_KEY, REQUEST_METADATA_KEY } from '../../../metadata/key/controller.metadata.key.ts';
import { MethodParameterMetadataType } from '../../../metadata/type/controller.metadata.type.ts';
import { MetadataContainer } from '../../../metadata/metadata.container.ts';
import { ConstructorFunction } from '../../../di/dumpling.container.ts';

export const Req = (): ParameterDecorator => {
  return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    if (propertyKey !== undefined) {
      const existingRequestParameters: MethodParameterMetadataType =
        MetadataContainer.getMethodMetadata(
          target.constructor as ConstructorFunction,
          propertyKey,
          REQUEST_METADATA_KEY,
        ) || {};

      existingRequestParameters[parameterIndex] = true;

      MetadataContainer.setMethodMetadata<MethodParameterMetadataType>(
        target.constructor as ConstructorFunction,
        propertyKey,
        REQUEST_METADATA_KEY,
        existingRequestParameters,
      );
    }
  };
};
