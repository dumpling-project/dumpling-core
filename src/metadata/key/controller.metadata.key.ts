import { HttpMethod, HttpMethodType } from '../../global/http/http.method.ts';
import exp from 'constants';

export const CONTROLLER = Symbol('controller');

// RequestMapping
export const REQUEST_MAPPING_METADATA_KEY = Symbol('requestMappingMetadataKey');

// Url Parameter
// export const PARAM_METADATA_KEY = Symbol('param'); // Param
// export const QUERY_METADATA_KEY = Symbol('query'); // Query
// export const BODY_METADATA_KEY = Symbol('body'); // Body
// export const REQUEST_METADATA_KEY = Symbol('request'); // Request

export const ROUTABLE_METHOD_PARAMETER_METADATA = Symbol('routableMethodParameterMetadataKey');

export const ROUTABLE_METHOD_PARAMETER_PIPE = Symbol('routableMethodParameterPipe');
