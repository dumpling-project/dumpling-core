import { HttpMethod, HttpMethodType } from '../global/http/http.method.ts';

export const CONTROLLER = 'controller';

export type ControllerMetadataType = {
  path: string;
};

// RequestMapping
export const REQUEST_MAPPING_METADATA_KEY = 'requestMappingMetadataKey';
export type RequestMappingMetadataType = { path: string; method: HttpMethodType };

// Url Parameter
export const PARAM_METADATA_KEY = 'param'; // Param
