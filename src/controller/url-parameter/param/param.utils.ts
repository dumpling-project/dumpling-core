import { RequestMapper } from '../../request-mapper/request.mapper.ts';
import { PARAM_METADATA_KEY } from '../../../metadata/key/controller.metadata.key.ts';

export interface ParamResultType {
  index: number;
  value: any;
}

export class ParamUtils {
  public static async applyParams(
    fullPath: string,
    urlPathName: string,
    target: Object,
    propertyKey: string | symbol,
    args: any[],
  ): Promise<Array<ParamResultType>> {
    const pathVariables = RequestMapper.extractPathVariables(fullPath, urlPathName);
    const requiredParameters = Reflect.getOwnMetadata(PARAM_METADATA_KEY, target, propertyKey) || {};
    return Object.entries(requiredParameters).map(([parameterIndex, parameterName]) => ({
      index: parseInt(parameterIndex, 10),
      value: pathVariables[parameterName as string],
    }));
  }
}
