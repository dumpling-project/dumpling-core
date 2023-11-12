import { REQUEST_METADATA_KEY } from '../../../key/controller.metadata.key.ts';

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
    const requiredRequestParameters = Reflect.getOwnMetadata(REQUEST_METADATA_KEY, target, propertyKey) || {};
    return Object.entries(requiredRequestParameters).map(([parameterIndex, _]) => ({
      index: parseInt(parameterIndex, 10),
      value: request,
    }));
  }
}
