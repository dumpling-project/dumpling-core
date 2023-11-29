import { REQUEST_MAPPING_METADATA_KEY } from '../../metadata/key/controller.metadata.key.ts';
import { HttpMethod } from '../../global/http/http.method.ts';
import { MetadataContainer } from '../../metadata/metadata.container.ts';
import { RequestMappingMetadataType } from '../../metadata/type/controller.metadata.type.ts';

export function Put(path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    // descriptor.value = async function (...args: any[]) {
    //   const controllerMetadata = MetadataContainer.getClassMetadata<ControllerMetadataType>(
    //     target.constructor,
    //     CONTROLLER,
    //   ) as ControllerMetadataType;
    //   const prefix = controllerMetadata.path;
    //   const fullPath = prefix ? prefix + path : path;
    //
    //   const request = args[0] as Request;
    //   const url = new URL(request.url);
    //
    //   let paramsResult = await ParamUtils.applyParams(fullPath, url.pathname, target, propertyKey, args);
    //   let queryResult = await QueryUtils.applyQuery(url, target, propertyKey, paramsResult);
    //   let bodyResult = await BodyUtils.applyBody(request, target, propertyKey, args);
    //   let requestResult = await RequestUtils.applyRequest(request, target, propertyKey, args);
    //
    //   let combinedResult = [...paramsResult, ...queryResult, ...bodyResult, ...requestResult];
    //   combinedResult.sort((a, b) => a.index - b.index);
    //   let modifiedArgs = combinedResult.map((item) => item.value);
    //
    //   return originalMethod.apply(this, modifiedArgs);
    // };

    const requestMappingMetadata: RequestMappingMetadataType = {
      path: path,
      method: HttpMethod.PUT,
    };

    MetadataContainer.setMethodMetadata(
      target.constructor,
      propertyKey as string,
      REQUEST_MAPPING_METADATA_KEY,
      requestMappingMetadata,
    );
  };
}
