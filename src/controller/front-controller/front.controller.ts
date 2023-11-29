import { Wheat } from '../../element/wheat.ts';
import { ConstructorFunction, DumplingContainer } from '../../di/dumpling.container.ts';
import { CONTROLLER, REQUEST_MAPPING_METADATA_KEY } from '../../metadata/key/controller.metadata.key.ts';
import { RouterUtils } from './router.utils.ts';
import { DynamicRouterNode } from './dynamic.router.node.ts';
import { HttpMethodType } from '../../global/http/http.method.ts';
import { MetadataContainer } from '../../metadata/metadata.container.ts';
import { ControllerMetadataType, RequestMappingMetadataType } from '../../metadata/type/controller.metadata.type.ts';
import { Orchestrator } from '../../orchestrator/orchestrator.ts';

type StaticRouteControllerMapType = {
  method: HttpMethodType;
  action: Function;
};

@Wheat()
export class FrontController {
  private staticRouteControllerMap: Map<String, StaticRouteControllerMapType> = new Map<
    String,
    StaticRouteControllerMapType
  >();
  private dynamicRouteControllerTreeRoot: DynamicRouterNode = new DynamicRouterNode('/');

  private routableMethodKeyMap: Map<Function, string> = new Map<Function, string>();

  constructor(private orchestrator: Orchestrator) {
    this.loadControllers();
  }
  private loadControllers() {
    const allWheatInstance = DumplingContainer.instance.getAllWheatInstance();

    allWheatInstance.forEach((wheat: any, wheatKey: ConstructorFunction) => {
      const target = wheatKey;
      const controllerMetadata = MetadataContainer.getClassMetadata<ControllerMetadataType>(target, CONTROLLER);

      if (controllerMetadata) {
        const methods = Object.getOwnPropertyNames(target.prototype);

        methods.forEach((methodName) => {
          const proxy = new Proxy(target.prototype, {
            get(target, prop, receiver) {
              if (typeof target[prop] === 'function') {
                return target[prop].bind(wheat);
              }
              return Reflect.get(target, prop, receiver);
            },
          });

          const method = proxy[methodName];

          const requestMappingMetadata: RequestMappingMetadataType | null = MetadataContainer.getMethodMetadata(
            target,
            methodName,
            REQUEST_MAPPING_METADATA_KEY,
          );

          const routableMethodKey = MetadataContainer.getMethodMetadataKey(target, methodName);
          const bindMethod = method.bind(wheat);

          this.routableMethodKeyMap.set(bindMethod, routableMethodKey);

          if (requestMappingMetadata) {
            requestMappingMetadata.fullPath = RouterUtils.joinPaths(
              controllerMetadata.path + requestMappingMetadata.path,
            );

            MetadataContainer.setMethodMetadata(
              target,
              methodName,
              REQUEST_MAPPING_METADATA_KEY,
              requestMappingMetadata,
            );

            if (!RouterUtils.isDynamicPath(requestMappingMetadata.path)) {
              this.registerStaticRouteController(controllerMetadata.path, requestMappingMetadata, bindMethod);
            }

            if (RouterUtils.isDynamicPath(requestMappingMetadata.path)) {
              this.registerDynamicRouteController(controllerMetadata.path, requestMappingMetadata, bindMethod);
            }
          }
        });
      }
    });
  }

  private registerStaticRouteController(
    controllerPath: string,
    requestMappingMetadata: RequestMappingMetadataType,
    controllerAction: Function,
  ) {
    const fullPath = RouterUtils.joinPaths(controllerPath + requestMappingMetadata.path);
    const key = requestMappingMetadata.method + ':' + fullPath;
    this.staticRouteControllerMap.set(key, { method: requestMappingMetadata.method, action: controllerAction });
  }

  private registerDynamicRouteController(
    controllerPath: string,
    requestMappingMetadata: RequestMappingMetadataType,
    controllerAction: Function,
  ) {
    const fullPath = RouterUtils.joinPaths(controllerPath + requestMappingMetadata.path);
    const segments = fullPath.split('/').filter((segment) => segment);
    let currentNode = this.dynamicRouteControllerTreeRoot;

    for (const segment of segments) {
      if (!currentNode.children.has(segment)) {
        currentNode.children.set(segment, new DynamicRouterNode(segment));
      }

      currentNode = currentNode.children.get(segment) as DynamicRouterNode;
    }

    currentNode.action.set(requestMappingMetadata.method, controllerAction);
  }

  private findStaticRouteController(method: HttpMethodType, fullPath: string): Function | null {
    const controllerKey = method + ':' + fullPath;
    const controllerAction = this.staticRouteControllerMap.get(controllerKey);

    return controllerAction ? controllerAction.action : null;
  }

  private findDynamicRouteController(method: HttpMethodType, fullPath: string): Function | null {
    const segments = fullPath.split('/').filter((segment) => segment);

    let currentNode = this.dynamicRouteControllerTreeRoot;

    for (const segment of segments) {
      if (currentNode.children.has(segment)) {
        currentNode = currentNode.children.get(segment) as DynamicRouterNode;
      } else {
        let dynamicNode = Array.from(currentNode.children.values()).find((node) => node.segment.startsWith(':'));
        if (dynamicNode) {
          currentNode = dynamicNode;
        } else {
          return null;
        }
      }
    }

    const controllerAction = currentNode.action.get(method);

    return controllerAction ? controllerAction : null;
  }

  public async router(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const fullPath = RouterUtils.joinPaths(path);
    let controllerAction: Function | null = null;
    let response = null;

    controllerAction = this.findStaticRouteController(method as HttpMethodType, fullPath);
    if (!controllerAction) {
      controllerAction = this.findDynamicRouteController(method as HttpMethodType, fullPath);
    }

    if (controllerAction) {
      response = await this.orchestrator.executeRoutableMethod(
        controllerAction,
        this.routableMethodKeyMap.get(controllerAction) as string,
        request,
      );
    }

    return response ? response : new Response('Not Found', { status: 404 });
  }
}
