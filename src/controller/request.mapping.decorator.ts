export const RequestMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
} as const
export type RequestMethod = typeof RequestMethod[keyof typeof RequestMethod]

export const REQUEST_MAPPING_METADATA_KEY = 'requestMappingMetadataKey'
export type RequestMappingMetadata = { path: string, method: RequestMethod }

export function Get(path: string): MethodDecorator {
    const requestMappingMetadata :RequestMappingMetadata = {
        path,
        method: RequestMethod.GET
    }
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(REQUEST_MAPPING_METADATA_KEY, requestMappingMetadata, descriptor.value);
  }
}

export function Post(path: string): MethodDecorator {
    const requestMappingMetadata :RequestMappingMetadata = {
        path,
        method: RequestMethod.POST
    }
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(REQUEST_MAPPING_METADATA_KEY, requestMappingMetadata, descriptor.value);
  }
}

export function Put(path: string): MethodDecorator {
    const requestMappingMetadata :RequestMappingMetadata = {
        path,
        method: RequestMethod.PUT
    }
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(REQUEST_MAPPING_METADATA_KEY, requestMappingMetadata, descriptor.value);
  }
}

export function Delete(path: string): MethodDecorator {
    const requestMappingMetadata :RequestMappingMetadata = {
        path,
        method: RequestMethod.DELETE
    }
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(REQUEST_MAPPING_METADATA_KEY, requestMappingMetadata, descriptor.value);
  }
}

export function Patch(path: string): MethodDecorator {
    const requestMappingMetadata :RequestMappingMetadata = {
        path,
        method: RequestMethod.PATCH
    }
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(REQUEST_MAPPING_METADATA_KEY, requestMappingMetadata, descriptor.value);
  }
}



