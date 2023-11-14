import { Wheat } from './wheat.ts';
import { ConstructorFunction } from '../di/dumpling.container.ts';
import { MetadataContainer } from '../metadata/metadata.container.ts';
import { MIDDLEWARE } from '../metadata/key/middleware.metadata.key.ts';

export function Middleware() {
  return function (target: ConstructorFunction) {
    MetadataContainer.setClassMetadata<boolean>(target, MIDDLEWARE, true);
    Wheat()(target);
  };
}
