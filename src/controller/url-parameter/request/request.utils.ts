import { REQUEST_METADATA_KEY } from '../../../metadata/key/controller.metadata.key.ts';
import { MetadataContainer } from '../../../metadata/metadata.container.ts';
import { ConstructorFunction } from '../../../di/dumpling.container.ts';

export type RequestResultType = {
  index: number;
  value: any;
};

export class RequestUtils {
  public static async applyRequest(
    request: Request,
    target: Object,
    propertyKey: string | symbol,
    args: any[],
  ): Promise<Array<RequestResultType>> {
    const requiredRequestParameters =
      MetadataContainer.getMethodMetadata(
        target.constructor as ConstructorFunction,
        propertyKey,
        REQUEST_METADATA_KEY,
      ) || {};

    return Object.entries(requiredRequestParameters).map(([parameterIndex, _]) => ({
      index: parseInt(parameterIndex, 10),
      value: request,
    }));
  }
}
