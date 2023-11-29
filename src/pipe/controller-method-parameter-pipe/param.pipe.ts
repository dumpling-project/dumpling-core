import { Wheat } from '../../element/wheat.ts';
import { RequestMapper } from '../../controller/request-mapper/request.mapper.ts';

@Wheat()
export class ParamPipe {
  async transform(request: Request, key: string, fullUrl: string): Promise<any> {
    const url = new URL(request.url);

    const pathVariables = RequestMapper.extractPathVariables(fullUrl, url.pathname);

    return pathVariables[key];
  }
}
