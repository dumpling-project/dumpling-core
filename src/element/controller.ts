import { Wheat } from './wheat.ts';
import { CONTROLLER } from '../metadata/key/controller.metadata.key.ts';
import { MetadataContainer } from '../metadata/metadata.container.ts';
import { ConstructorFunction } from '../di/dumpling.container.ts';
import { ControllerMetadataType } from '../metadata/type/controller.metadata.type.ts';

export function Controller(path: string) {
  return function (target: ConstructorFunction) {
    const metadata: ControllerMetadataType = {
      path: path,
    };
    // Reflect.defineMetadata(CONTROLLER, metadata, target);
    MetadataContainer.setClassMetadata(target, CONTROLLER, metadata);
    Wheat()(target);
  };
}
