import { HttpMethod, HttpMethodType } from '../../global/http/http.method.ts';

export const CONTROLLER = Symbol('controller');

// RequestMapping
export const REQUEST_MAPPING_METADATA_KEY = Symbol('requestMappingMetadataKey');

// Url Parameter
export const PARAM_METADATA_KEY = 'param'; // Param
export const QUERY_METADATA_KEY = 'query'; // Query
export const BODY_METADATA_KEY = 'body'; // Body
export const REQUEST_METADATA_KEY = 'request'; // Request
