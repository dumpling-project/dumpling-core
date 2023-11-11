import { RequestMapper } from '../../request-mapper/request.mapper.ts';
import { PARAM_METADATA_KEY } from '../../../key/controller.metadata.key.ts';

export interface ParamResultType {
  index: number;
  value: string;
}

export class ParamUtils {
  public static applyParams(
    fullPath: string,
    urlPathName: string,
    target: Object,
    propertyKey: string | symbol,
    args: any[],
  ): Array<ParamResultType> {
    const pathVariables = RequestMapper.extractPathVariables(fullPath, urlPathName);
    const requiredParameters = Reflect.getOwnMetadata(PARAM_METADATA_KEY, target, propertyKey) || {};
    return Object.entries(requiredParameters).map(([parameterIndex, parameterName]) => ({
      index: parseInt(parameterIndex, 10),
      value: pathVariables[parameterName as string],
    }));
  }
}
