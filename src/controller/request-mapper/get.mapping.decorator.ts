import {
  PARAM_METADATA_KEY,
  REQUEST_MAPPING_METADATA_KEY,
  RequestMappingMetadataType,
} from '../../key/controller.metadata.key.ts';
import { RequestMapper } from './request.mapper.ts';
import { HttpMethod } from '../../global/http/http.method.ts';

export function Get(path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const request = args[0] as Request;
      const url = new URL(request.url);
      const params = new URLSearchParams(url.search);
      const pathVariables = RequestMapper.extractPathVariables(path, url.pathname);

      const requiredParameters = Reflect.getOwnMetadata(PARAM_METADATA_KEY, target, propertyKey) || {};
      const modifiedArgs = args.slice();
      for (let [parameterIndex, parameterName] of Object.entries(requiredParameters)) {
        modifiedArgs[parseInt(parameterIndex, 10)] = pathVariables[parameterName as string];
      }

      return originalMethod.apply(this, modifiedArgs);
    };

    const requestMappingMetadata: RequestMappingMetadataType = {
      path,
      method: HttpMethod.GET,
    };

    Reflect.defineMetadata(REQUEST_MAPPING_METADATA_KEY, requestMappingMetadata, descriptor.value);
  };
}
