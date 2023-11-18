import {
  CONTROLLER,
  PARAM_METADATA_KEY,
  REQUEST_MAPPING_METADATA_KEY,
} from '../../metadata/key/controller.metadata.key.ts';
import { RequestMapper } from './request.mapper.ts';
import { HttpMethod } from '../../global/http/http.method.ts';
import { ParamUtils } from '../url-parameter/param/param.utils.ts';
import { QueryUtils } from '../url-parameter/query/query.utils.ts';
import { RequestUtils } from '../url-parameter/request/request.utils.ts';
import { MetadataContainer } from '../../metadata/metadata.container.ts';
import { ControllerMetadataType, RequestMappingMetadataType } from '../../metadata/type/controller.metadata.type.ts';

export function Get(path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    // descriptor.value = async function (...args: any[]) {
    //   const controllerMetadata = MetadataContainer.getClassMetadata<ControllerMetadataType>(
    //     target.constructor,
    //     CONTROLLER,
    //   ) as ControllerMetadataType;
    //   const prefix = controllerMetadata.path;
    //   path;
    //   const fullPath = prefix ? prefix + path : path;
    //
    //   const request = args[0] as Request;
    //   const url = new URL(request.url);
    //
    //   let paramsResult = await ParamUtils.applyParams(fullPath, url.pathname, target, propertyKey, args);
    //   let queryResult = await QueryUtils.applyQuery(url, target, propertyKey, paramsResult);
    //   let requestResult = await RequestUtils.applyRequest(request, target, propertyKey, args);
    //
    //   let combinedResult = [...paramsResult, ...queryResult, ...requestResult];
    //   combinedResult.sort((a, b) => a.index - b.index);
    //   let modifiedArgs = combinedResult.map((item) => item.value);
    //
    //   return originalMethod.apply(this, modifiedArgs);
    // };

    const requestMappingMetadata: RequestMappingMetadataType = {
      path,
      method: HttpMethod.GET,
    };

    MetadataContainer.setMethodMetadata(
      target.constructor,
      propertyKey as string,
      REQUEST_MAPPING_METADATA_KEY,
      requestMappingMetadata,
    );
  };
}
