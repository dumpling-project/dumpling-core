import { ConstructorFunction, DumplingContainer } from '../di/dumpling.container.ts';

export function UseMiddleware(middleware: ConstructorFunction) {
  return function (target: Object | Function, propertyKey?: string, descriptor?: PropertyDescriptor) {
    const isMethod = propertyKey !== undefined && descriptor !== undefined && typeof target === 'object';
    const isClass = typeof target === 'function' && propertyKey === undefined;

    if (isMethod) {
      const originalMethod = descriptor.value;

      descriptor.value = function (...args: any[]) {
        const middlewareInstance = DumplingContainer.instance.getWheatInstance(middleware);
        const [request, response] = args;
        return middlewareInstance.execute(request, response, () => originalMethod.apply(this, args));
      };
    }

    if (isClass) {
      const prototype = target.prototype;

      Object.getOwnPropertyNames(prototype).forEach((methodName) => {
        if (methodName !== 'constructor') {
          const originalMethod = prototype[methodName];
          prototype[methodName] = function (...args: any[]) {
            const middlewareInstance = DumplingContainer.instance.getWheatInstance(middleware);
            const [request, response] = args;
            return middlewareInstance.execute(request, response, () => originalMethod.apply(this, args));
          };
        }
      });
    }
  };
}
