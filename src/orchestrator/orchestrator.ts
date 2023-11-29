import { ConstructorFunction, DumplingContainer } from '../di/dumpling.container.ts';
import { MetadataContainer } from '../metadata/metadata.container.ts';
import {
  ControllerMetadataType,
  RequestMappingMetadataType,
  RoutableMethodParameterMetadataType,
  RoutableMethodParameterPipeMetadataType,
  RoutableMethodParameterType,
} from '../metadata/type/controller.metadata.type.ts';
import {
  CONTROLLER,
  REQUEST_MAPPING_METADATA_KEY,
  ROUTABLE_METHOD_PARAMETER_METADATA,
  ROUTABLE_METHOD_PARAMETER_PIPE,
} from '../metadata/key/controller.metadata.key.ts';
import { UseMiddlewareMetadataType } from '../metadata/type/middleware.metadata.type.ts';
import { USE_MIDDLEWARE_METADATA_KEY } from '../metadata/key/middleware.metadata.key.ts';
import { AbstractMiddleware } from '../middleware/middleware.abstract.ts';
import { BodyPipe } from '../pipe/controller-method-parameter-pipe/body.pipe.ts';
import { PipeInterface } from '../pipe/pipe.interface.ts';
import { ParamPipe } from '../pipe/controller-method-parameter-pipe/param.pipe.ts';
import { QueryPipe } from '../pipe/controller-method-parameter-pipe/query.pipe.ts';
import { RequestPipe } from '../pipe/controller-method-parameter-pipe/request.pipe.ts';

type RoutableMethodOriginalDataMap = {
  method: Function;
  constructorFunction: ConstructorFunction;
};

type ReformRoutableMethodParameterMetadataType = {
  [key: number]: {
    value: any;
    type: RoutableMethodParameterType;
  };
};

type ReformRoutableMethodParameterPipeMetadataType = { [key: number]: ConstructorFunction[] };

export class Orchestrator {
  private _routableMethodKeyList: string[] = [];

  private _routableMethodOriginalDataMap: Map<string, RoutableMethodOriginalDataMap> = new Map<
    string,
    RoutableMethodOriginalDataMap
  >();
  private _routableMethodMiddlewareMap: Map<string, UseMiddlewareMetadataType> = new Map<
    string,
    UseMiddlewareMetadataType
  >();
  private _routableMethodParameterMap: Map<string, ReformRoutableMethodParameterMetadataType> = new Map<
    string,
    ReformRoutableMethodParameterMetadataType
  >();

  private _routableMethodParameterPipeMap: Map<string, ReformRoutableMethodParameterPipeMetadataType> = new Map<
    string,
    ReformRoutableMethodParameterPipeMetadataType
  >();

  constructor() {
    this.loadRoutableMethodInformation();
    this.loadMiddlewareInformation();
    this.loadRoutableMethodParameterInformation();
    this.loadRoutableMethodParameterPipeInformation();
  }

  private loadRoutableMethodInformation() {
    const allWheatInstance = DumplingContainer.instance.getAllWheatInstance();

    const routableMethodKeyList = Array.from(allWheatInstance.entries())
      .map(([wheatKey, wheat]) => {
        const target = wheatKey;
        const controllerMetadata = MetadataContainer.getClassMetadata<ControllerMetadataType>(target, CONTROLLER);

        if (controllerMetadata) {
          const methods = Object.getOwnPropertyNames(target.prototype);
          return methods.map((methodName) => {
            const routableMethodKey = MetadataContainer.getMethodMetadataKey(target, methodName);
            this._routableMethodOriginalDataMap.set(routableMethodKey, {
              method: target.prototype[methodName],
              constructorFunction: target,
            });
            return routableMethodKey;
          });
        }
        return [];
      })
      .flat();

    this._routableMethodKeyList = routableMethodKeyList;
  }

  private loadMiddlewareInformation() {
    this._routableMethodKeyList.forEach((methodKey) => {
      const useMiddlewareOrderList =
        MetadataContainer.getMethodMetadataByKey<UseMiddlewareMetadataType>(methodKey, USE_MIDDLEWARE_METADATA_KEY) ||
        [];

      this._routableMethodMiddlewareMap.set(methodKey, useMiddlewareOrderList);
    });
  }

  private loadRoutableMethodParameterInformation() {
    this._routableMethodKeyList.forEach((methodKey) => {
      const routableMethodParameterBodyMetadata =
        MetadataContainer.getMethodMetadataByKey<RoutableMethodParameterMetadataType>(
          methodKey,
          ROUTABLE_METHOD_PARAMETER_METADATA,
        ) || [];

      const reformRoutableMethodParameterBodyMetadata: ReformRoutableMethodParameterMetadataType =
        routableMethodParameterBodyMetadata.reduce<ReformRoutableMethodParameterMetadataType>(
          (acc, { index, ...rest }) => {
            acc[index] = rest;
            return acc;
          },
          {},
        );

      this._routableMethodParameterMap.set(methodKey, reformRoutableMethodParameterBodyMetadata);
    });
  }

  private loadRoutableMethodParameterPipeInformation() {
    this._routableMethodKeyList.forEach((methodKey) => {
      const routableMethodParameterBodyMetadata =
        MetadataContainer.getMethodMetadataByKey<RoutableMethodParameterPipeMetadataType>(
          methodKey,
          ROUTABLE_METHOD_PARAMETER_PIPE,
        ) || [];

      const reformedRoutableMethodParameterPipeMetadata: { [key: number]: ConstructorFunction[] } =
        this.reformRoutableMethodParameterPipeMetadata(routableMethodParameterBodyMetadata);

      const methodParameter = this._routableMethodParameterMap.get(methodKey);
      for (const key in methodParameter) {
        const parameterType = methodParameter[Number(key)].type;
        switch (parameterType) {
          case 'BODY':
            reformedRoutableMethodParameterPipeMetadata[Number(key)] === undefined
              ? (reformedRoutableMethodParameterPipeMetadata[Number(key)] = [BodyPipe])
              : reformedRoutableMethodParameterPipeMetadata[Number(key)].unshift(BodyPipe);
            break;
          case 'PARAM':
            reformedRoutableMethodParameterPipeMetadata[Number(key)] === undefined
              ? (reformedRoutableMethodParameterPipeMetadata[Number(key)] = [ParamPipe])
              : reformedRoutableMethodParameterPipeMetadata[Number(key)].unshift(ParamPipe);
            break;
          case 'QUERY':
            reformedRoutableMethodParameterPipeMetadata[Number(key)] === undefined
              ? (reformedRoutableMethodParameterPipeMetadata[Number(key)] = [QueryPipe])
              : reformedRoutableMethodParameterPipeMetadata[Number(key)].unshift(QueryPipe);
            break;
          case 'REQUEST':
            reformedRoutableMethodParameterPipeMetadata[Number(key)] === undefined
              ? (reformedRoutableMethodParameterPipeMetadata[Number(key)] = [RequestPipe])
              : reformedRoutableMethodParameterPipeMetadata[Number(key)].unshift(RequestPipe);
            break;
        }
      }

      this._routableMethodParameterPipeMap.set(methodKey, reformedRoutableMethodParameterPipeMetadata);
    });
  }

  private reformRoutableMethodParameterPipeMetadata(data: RoutableMethodParameterPipeMetadataType) {
    return data.reduce<{ [key: number]: ConstructorFunction[] }>((acc, item) => {
      const key = item.parameterIndex;

      if (!acc[key]) {
        acc[key] = [];
      }
      // 해당 키의 배열에 함수 추가
      acc[key].push(item.pipe);
      return acc;
    }, {});
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
      return middlewareInstance.execute(
        request,
        response,
        async () => await this.executePipelineForEachParams(request, response, routableMethodProxy, routableMethodKey),
      );
    };

    return await executeMiddlewareSequence(0);
  }

  private async executePipelineForEachParams(
    request: Request,
    response: Response,
    routableMethodProxy: Function,
    routableMethodKey: string,
  ) {
    const requestMappingMetadata = MetadataContainer.getMethodMetadataByKey<RequestMappingMetadataType>(
      routableMethodKey,
      REQUEST_MAPPING_METADATA_KEY,
    ) as RequestMappingMetadataType;

    const routableMethodParameter = [];
    //full path is available on requestMappingMetadata.fullPath
    const routableMethodParameterMetadata = this._routableMethodParameterMap.get(routableMethodKey) || [];
    for (const key in routableMethodParameterMetadata) {
      const { type, value } = routableMethodParameterMetadata[Number(key)];

      const pipes = this._routableMethodParameterPipeMap.get(routableMethodKey)?.[Number(key)] || [];

      const firstPipe: ConstructorFunction<PipeInterface> = pipes[0] as ConstructorFunction<PipeInterface>;
      let initialValue = undefined;
      switch (type) {
        case 'BODY':
          const firstBodyPipeInstance: BodyPipe = DumplingContainer.instance.getWheatInstance(firstPipe);
          initialValue = await firstBodyPipeInstance.transform(request, value.searchKey);
          break;
        case 'PARAM':
          const fullPath = requestMappingMetadata.fullPath as string;
          const firstParamPipeInstance: ParamPipe = DumplingContainer.instance.getWheatInstance(firstPipe);
          initialValue = await firstParamPipeInstance.transform(request, value.paramName, fullPath);
          break;
        case 'QUERY':
          const firstQueryPipeInstance: QueryPipe = DumplingContainer.instance.getWheatInstance(firstPipe);
          initialValue = await firstQueryPipeInstance.transform(request, value.paramName);
          break;
        case 'REQUEST':
          const firstRequestPipeInstance: RequestPipe = DumplingContainer.instance.getWheatInstance(firstPipe);
          initialValue = await firstRequestPipeInstance.transform(request);
          break;
      }

      for (const pipe of pipes.slice(1)) {
        const pipeInstance: PipeInterface = DumplingContainer.instance.getWheatInstance(pipe);
        initialValue = await pipeInstance.transform(initialValue);
      }

      routableMethodParameter[Number(key)] = initialValue;
    }

    return await routableMethodProxy(...routableMethodParameter);
  }
}
