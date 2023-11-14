import { BODY_METADATA_KEY, PARAM_METADATA_KEY } from '../../../metadata/key/controller.metadata.key.ts';
import { MethodParameterMetadataType } from '../../../metadata/type/controller.metadata.type.ts';
import { MetadataContainer } from '../../../metadata/metadata.container.ts';
import { ConstructorFunction } from '../../../di/dumpling.container.ts';

export const Param = (parameterName: string): ParameterDecorator => {
  return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    if (propertyKey !== undefined) {
      const existingParamParameters: MethodParameterMetadataType =
        MetadataContainer.getMethodMetadata(
          target.constructor as ConstructorFunction,
          propertyKey,
          PARAM_METADATA_KEY,
        ) || {};

      existingParamParameters[parameterIndex] = parameterName;

      MetadataContainer.setMethodMetadata<MethodParameterMetadataType>(
        target.constructor as ConstructorFunction,
        propertyKey,
        PARAM_METADATA_KEY,
        existingParamParameters,
      );
    }
  };
};
