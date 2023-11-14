import { HttpMethodType } from '../../global/http/http.method.ts';

export type ControllerMetadataType = {
  path: string;
};

export type RequestMappingMetadataType = { path: string; method: HttpMethodType };
