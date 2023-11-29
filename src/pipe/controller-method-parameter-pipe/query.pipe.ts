import { Wheat } from '../../element/wheat.ts';
import { RequestMapper } from '../../controller/request-mapper/request.mapper.ts';

@Wheat()
export class QueryPipe {
  async transform(request: Request, key: string): Promise<any> {
    const url = new URL(request.url);

    const queryVariables = new URLSearchParams(url.search);
    return queryVariables.get(key);
  }
}
