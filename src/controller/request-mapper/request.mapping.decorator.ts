import { REQUEST_MAPPING_METADATA_KEY, RequestMappingMetadataType } from '../../key/controller.metadata.key.ts';
import { HttpMethod } from '../../global/http/http.method.ts';

export function Put(path: string): MethodDecorator {
  const requestMappingMetadata: RequestMappingMetadataType = {
    path,
    method: HttpMethod.PUT,
  };
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(REQUEST_MAPPING_METADATA_KEY, requestMappingMetadata, descriptor.value);
  };
}

export function Delete(path: string): MethodDecorator {
  const requestMappingMetadata: RequestMappingMetadataType = {
    path,
    method: HttpMethod.DELETE,
  };
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(REQUEST_MAPPING_METADATA_KEY, requestMappingMetadata, descriptor.value);
  };
}

export function Patch(path: string): MethodDecorator {
  const requestMappingMetadata: RequestMappingMetadataType = {
    path,
    method: HttpMethod.PATCH,
  };
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(REQUEST_MAPPING_METADATA_KEY, requestMappingMetadata, descriptor.value);
  };
}
