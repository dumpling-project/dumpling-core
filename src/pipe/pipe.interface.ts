import { PipeType } from '../metadata/type/pipe.metadata.type.ts';

export interface PipeInterface {
  metadata: Array<PipeType>;

  transform(value: any): any;
}
