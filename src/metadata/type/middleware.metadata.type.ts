import { ConstructorFunction } from '../../di/dumpling.container.ts';

export type UseMiddlewareMetadataType = Array<{
  middleware: ConstructorFunction;
  methodName: string;
}>;
