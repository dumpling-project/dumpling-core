import { DumplingContainer } from '../di/dumpling.container.ts';
import { MetadataContainer } from '../metadata/metadata.container.ts';
import { ControllerMetadataType } from '../metadata/type/controller.metadata.type.ts';
import { CONTROLLER } from '../metadata/key/controller.metadata.key.ts';
import { UseMiddlewareMetadataType } from '../metadata/type/middleware.metadata.type.ts';
import { USE_MIDDLEWARE_METADATA_KEY } from '../metadata/key/middleware.metadata.key.ts';
import { AbstractMiddleware } from '../middleware/middleware.abstract.ts';

export class Orchestrator {
  private _routableMethodKeyList: string[] = [];

  private _routableMethodMiddlewareMap: Map<string, UseMiddlewareMetadataType> = new Map<
    string,
    UseMiddlewareMetadataType
  >();

  constructor() {
    this.loadOrchestrationInformation();
  }

  private loadOrchestrationInformation() {
    const allWheatInstance = DumplingContainer.instance.getAllWheatInstance();

    const routableMethodKeyList = Array.from(allWheatInstance.entries())
      .map(([wheatKey, wheat]) => {
        const target = wheatKey;
        const controllerMetadata = MetadataContainer.getClassMetadata<ControllerMetadataType>(target, CONTROLLER);

        if (controllerMetadata) {
          const methods = Object.getOwnPropertyNames(target.prototype);
          return methods.map((methodName) => {
            return MetadataContainer.getMethodMetadataKey(target, methodName);
          });
        }
        return [];
      })
      .flat();

    this._routableMethodKeyList = routableMethodKeyList;

    routableMethodKeyList.forEach((methodKey) => {
      const useMiddlewareOrderList =
        MetadataContainer.getMethodMetadataByKey<UseMiddlewareMetadataType>(methodKey, USE_MIDDLEWARE_METADATA_KEY) ||
        [];

      this._routableMethodMiddlewareMap.set(methodKey, useMiddlewareOrderList);
    });
  }

  public async executeRoutableMethod(routableMethodProxy: Function, routableMethodKey: string, request: Request) {
    const middlewareList = this._routableMethodMiddlewareMap.get(routableMethodKey) || [];

    const response = new Response();
    const executeMiddlewareSequence = async (index: number): Promise<any> => {
      const middlewareInstance: AbstractMiddleware = DumplingContainer.instance.getWheatInstance(
        middlewareList[index].middleware,
      );
      if (index < middlewareList.length - 1) {
        return middlewareInstance.execute(request, response, () => executeMiddlewareSequence(index + 1));
      }
      return middlewareInstance.execute(request, response, async () => await routableMethodProxy(...arguments));
    };

    return await executeMiddlewareSequence(0);
  }
}
