import { HttpMethodType } from '../../global/http/http.method.ts';
import { ConstructorFunction } from '../../di/dumpling.container.ts';

export type ControllerMetadataType = {
  path: string;
};

export type RequestMappingMetadataType = { path: string; method: HttpMethodType; fullPath?: string };

export const RoutableMethodParameterTypeEnum = {
  PARAM: 'PARAM',
  QUERY: 'QUERY',
  BODY: 'BODY',
  REQUEST: 'REQUEST',
} as const;
export type RoutableMethodParameterType =
  (typeof RoutableMethodParameterTypeEnum)[keyof typeof RoutableMethodParameterTypeEnum];

export type RoutableMethodParameterMetadataType = Array<{
  index: number;
  value: any;
  type: RoutableMethodParameterType;
}>;

export type RoutableMethodParameterPipeMetadataType = Array<{ parameterIndex: number; pipe: ConstructorFunction }>;
