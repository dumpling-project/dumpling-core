import {
  CONTROLLER,
  PARAM_METADATA_KEY,
  REQUEST_MAPPING_METADATA_KEY,
  RequestMappingMetadataType,
} from '../../key/controller.metadata.key.ts';
import { RequestMapper } from './request.mapper.ts';
import { HttpMethod } from '../../global/http/http.method.ts';
import { ParamUtils } from '../url-parameter/param/param.utils.ts';
import { QueryUtils } from '../url-parameter/query/query.utils.ts';

export function Get(path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const prefix = Reflect.getMetadata(CONTROLLER, target.constructor).path;
      const fullPath = prefix ? prefix + path : path;

      const request = args[0] as Request;
      const url = new URL(request.url);

      let paramsResult = await ParamUtils.applyParams(fullPath, url.pathname, target, propertyKey, args);
      let queryResult = await QueryUtils.applyQuery(url, target, propertyKey, paramsResult);

      let combinedResult = [...paramsResult, ...queryResult];
      combinedResult.sort((a, b) => a.index - b.index);
      let modifiedArgs = combinedResult.map((item) => item.value);

      return originalMethod.apply(this, modifiedArgs);
    };

    const requestMappingMetadata: RequestMappingMetadataType = {
      path,
      method: HttpMethod.GET,
    };

    Reflect.defineMetadata(REQUEST_MAPPING_METADATA_KEY, requestMappingMetadata, descriptor.value);
  };
}
