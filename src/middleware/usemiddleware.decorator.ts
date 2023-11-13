import { ConstructorFunction, DumplingContainer } from '../di/dumpling.container.ts';
import type { MiddlewareInterface } from './middleware.interface.d.ts';
import { REQUEST_MAPPING_METADATA_KEY } from '../key/controller.metadata.key.ts';
import { type } from 'os';

export function UseMiddleware(middleware: ConstructorFunction) {
  return function (target: Object | Function, propertyKey?: string, descriptor?: PropertyDescriptor) {
    console.log(target);
    // if (descriptor && typeof target === 'object') {
    //   const originalMethod = descriptor.value;
    //
    //   const proxyMethod = async function (...args: any[]) {
    //     if (typeof target === 'object') {
    //       const dumplingContainer = DumplingContainer.instance;
    //       const middlewareInstance = dumplingContainer.getWheatInstance(middleware) as MiddlewareInterface;
    //
    //       // 미들웨어 실행
    //       await middlewareInstance.execute(args[0], args[1]);
    //
    //       console.log(originalMethod.get());
    //
    //       // 원본 메소드 실행
    //       return await originalMethod.apply(this, args);
    //     }
    //   }.bind(target);
    //
    //   // 프록시 메소드로 기존 메소드 대체
    //   descriptor.value = proxyMethod;
    // }
  };
}
