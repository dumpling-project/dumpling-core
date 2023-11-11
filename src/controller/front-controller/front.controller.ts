import { Wheat } from '../../element/wheat.ts';
import { ConstructorFunction, DumplingContainer } from '../../di/dumpling.container.ts';
import {
  CONTROLLER,
  REQUEST_MAPPING_METADATA_KEY,
  RequestMappingMetadataType,
} from '../../key/controller.metadata.key.ts';
import { RouterUtils } from './router.utils.ts';
import { DynamicRouterNode } from './dynamic.router.node.ts';
import { HttpMethodType } from '../../global/http/http.method.ts';

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

  constructor() {
    this.loadControllers();
  }
  private loadControllers() {
    const allWheatInstance = DumplingContainer.instance.getAllWheatInstance();

    allWheatInstance.forEach((wheat: any, wheatKey: ConstructorFunction) => {
      const target = wheatKey;
      const controllerMetadata = Reflect.getMetadata(CONTROLLER, target);

      if (controllerMetadata) {
        const methods = Object.getOwnPropertyNames(target.prototype);

        methods.forEach((methodName) => {
          const method = target.prototype[methodName];

          const requestMappingMetadata: RequestMappingMetadataType = Reflect.getMetadata(
            REQUEST_MAPPING_METADATA_KEY,
            method,
          );

          if (requestMappingMetadata && !RouterUtils.isDynamicPath(requestMappingMetadata.path)) {
            this.registerStaticRouteController(controllerMetadata.path, requestMappingMetadata, method.bind(wheat));
          }

          if (requestMappingMetadata && RouterUtils.isDynamicPath(requestMappingMetadata.path)) {
            this.registerDynamicRouteController(controllerMetadata.path, requestMappingMetadata, method.bind(wheat));
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

    console.log('fullPath', fullPath);
    console.log('method', method);

    controllerAction = this.findStaticRouteController(method as HttpMethodType, fullPath);
    if (controllerAction) {
      response = (await controllerAction(request)) as Response;
    }

    if (!controllerAction) {
      controllerAction = this.findDynamicRouteController(method as HttpMethodType, fullPath);
      if (controllerAction) {
        response = (await controllerAction(request)) as Response;
      }
    }

    return response ? response : new Response('Not Found', { status: 404 });
  }
}
