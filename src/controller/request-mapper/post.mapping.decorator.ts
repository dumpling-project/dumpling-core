import {
  CONTROLLER,
  REQUEST_MAPPING_METADATA_KEY,
  RequestMappingMetadataType,
} from '../../key/controller.metadata.key.ts';
import { HttpMethod } from '../../global/http/http.method.ts';
import { ParamUtils } from '../url-parameter/param/params.utils.ts';

export function Post(path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const prefix = Reflect.getMetadata(CONTROLLER, target.constructor).path;
      const fullPath = prefix ? prefix + path : path;

      const request = args[0] as Request;
      const url = new URL(request.url);

      const modifiedArgs = ParamUtils.applyParams(fullPath, url.pathname, target, propertyKey, args);

      return originalMethod.apply(this, modifiedArgs);
    };

    const requestMappingMetadata: RequestMappingMetadataType = {
      path,
      method: HttpMethod.POST,
    };

    Reflect.defineMetadata(REQUEST_MAPPING_METADATA_KEY, requestMappingMetadata, descriptor.value);
  };
}
