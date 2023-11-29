import { PipeTypeEnum } from '../../metadata/type/pipe.metadata.type.ts';
import { PipeInterface } from '../pipe.interface.ts';
import { WHEAT } from '../../metadata/key/wheat.metadata.key.ts';
import { Wheat } from '../../element/wheat.ts';

@Wheat()
export class BodyPipe implements PipeInterface {
  public metadata = [PipeTypeEnum.BODY];
  async transform(request: Request, key?: string): Promise<any> {
    const resolvedBody = await this.resolveBody(request);

    if (key) {
      return resolvedBody[key];
    }
    return resolvedBody;
  }

  private async resolveBody(request: Request): Promise<any> {
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await request.json();
    } else {
      return undefined;
    }
  }
}
