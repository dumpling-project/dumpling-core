import { Wheat } from '../src';

@Wheat()
export class AppService {
  public hello(id: string) {
    return 'hello world' + id;
  }
}
