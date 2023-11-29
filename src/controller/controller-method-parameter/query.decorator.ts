import {
  ROUTABLE_METHOD_PARAMETER_METADATA,
  ROUTABLE_METHOD_PARAMETER_PIPE,
} from '../../metadata/key/controller.metadata.key.ts';
import {
  RoutableMethodParameterMetadataType,
  RoutableMethodParameterPipeMetadataType,
  RoutableMethodParameterTypeEnum,
} from '../../metadata/type/controller.metadata.type.ts';
import { MetadataContainer } from '../../metadata/metadata.container.ts';
import { ConstructorFunction } from '../../di/dumpling.container.ts';
import { PipeInterface } from '../../pipe/pipe.interface.ts';

export const Query = (name: string, pipes?: Array<ConstructorFunction<PipeInterface>>): ParameterDecorator => {
  return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    if (propertyKey !== undefined) {
      const existingQueryParameters: RoutableMethodParameterMetadataType =
        MetadataContainer.getMethodMetadata(
          target.constructor as ConstructorFunction,
          propertyKey,
          ROUTABLE_METHOD_PARAMETER_METADATA,
        ) || [];

      existingQueryParameters.push({
        index: parameterIndex,
        value: { paramName: name },
        type: RoutableMethodParameterTypeEnum.QUERY,
      });

      MetadataContainer.setMethodMetadata<RoutableMethodParameterMetadataType>(
        target.constructor as ConstructorFunction,
        propertyKey,
        ROUTABLE_METHOD_PARAMETER_METADATA,
        existingQueryParameters,
      );

      const existingMethodParameterPipe: RoutableMethodParameterPipeMetadataType =
        MetadataContainer.getMethodMetadata(
          target.constructor as ConstructorFunction,
          propertyKey,
          ROUTABLE_METHOD_PARAMETER_PIPE,
        ) || [];

      for (const pipe of pipes || []) {
        existingMethodParameterPipe.push({
          parameterIndex: parameterIndex,
          pipe: pipe,
        });
      }

      MetadataContainer.setMethodMetadata(
        target.constructor as ConstructorFunction,
        propertyKey,
        ROUTABLE_METHOD_PARAMETER_PIPE,
        existingMethodParameterPipe,
      );
    }
  };
};
