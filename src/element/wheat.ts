import 'reflect-metadata';
import { MetadataContainer } from '../metadata/metadata.container.ts';
import { ConstructorFunction } from '../di/dumpling.container.ts';
import { WHEAT } from '../metadata/key/wheat.metadata.key.ts';

export function Wheat() {
  return function (target: ConstructorFunction) {
    MetadataContainer.setClassMetadata<boolean>(target, WHEAT, true);
  };
}
