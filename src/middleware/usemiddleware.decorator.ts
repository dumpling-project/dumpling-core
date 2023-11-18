import { ConstructorFunction, DumplingContainer } from '../di/dumpling.container.ts';
import { MetadataContainer } from '../metadata/metadata.container.ts';
import { USE_MIDDLEWARE_METADATA_KEY } from '../metadata/key/middleware.metadata.key.ts';
import { UseMiddlewareMetadataType } from '../metadata/type/middleware.metadata.type.ts';

export function UseMiddleware(middleware: ConstructorFunction) {
  return function (target: Object | Function, propertyKey?: string, descriptor?: PropertyDescriptor) {
    const isMethod = propertyKey !== undefined && descriptor !== undefined && typeof target === 'object';
    const isClass = typeof target === 'function' && propertyKey === undefined;

    if (isMethod) {
      const originalMethod = descriptor.value;

      // descriptor.value = function (...args: any[]) {
      //   const middlewareInstance = DumplingContainer.instance.getWheatInstance(middleware);
      //   const [request, response] = args;
      //   return middlewareInstance.execute(request, response, () => originalMethod.apply(this, args));
      // };

      const useMiddlewareMetadata =
        MetadataContainer.getMethodMetadata<UseMiddlewareMetadataType>(
          target.constructor as ConstructorFunction,
          propertyKey,
          USE_MIDDLEWARE_METADATA_KEY,
        ) || [];

      useMiddlewareMetadata.unshift({
        middleware,
        methodName: propertyKey,
      });

      MetadataContainer.setMethodMetadata(
        target.constructor as ConstructorFunction,
        propertyKey,
        USE_MIDDLEWARE_METADATA_KEY,
        useMiddlewareMetadata,
      );
    }

    if (isClass) {
      const prototype = target.prototype;

      Object.getOwnPropertyNames(prototype).forEach((methodName) => {
        if (methodName !== 'constructor') {
          // const originalMethod = prototype[methodName];

          const useMiddlewareMetadata =
            MetadataContainer.getMethodMetadata<UseMiddlewareMetadataType>(
              target as ConstructorFunction,
              methodName,
              USE_MIDDLEWARE_METADATA_KEY,
            ) || [];

          useMiddlewareMetadata.unshift({
            middleware,
            methodName,
          });

          MetadataContainer.setMethodMetadata(
            target as ConstructorFunction,
            methodName,
            USE_MIDDLEWARE_METADATA_KEY,
            useMiddlewareMetadata,
          );

          // prototype[methodName] = function (...args: any[]) {
          //   // const middlewareInstance = DumplingContainer.instance.getWheatInstance(middleware);
          //   // const [request, response] = args;
          //   // return middlewareInstance.execute(request, response, () => originalMethod.apply(this, args));
          // };
        }
      });
    }
  };
}
