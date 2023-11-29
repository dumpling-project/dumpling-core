import { Wheat } from '../../element/wheat.ts';
import { RequestMapper } from '../../controller/request-mapper/request.mapper.ts';

@Wheat()
export class RequestPipe {
  async transform(request: Request): Promise<any> {
    return request;
  }
}
