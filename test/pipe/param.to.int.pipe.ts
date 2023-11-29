import { PipeInterface, PipeTypeEnum, Wheat } from '../../src';

@Wheat()
export class ParamToIntPipe implements PipeInterface {
  metadata = [PipeTypeEnum.PARAM];
  async transform(value: string): Promise<any> {
    return parseInt(value);
  }
}
