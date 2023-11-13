import { MIDDLEWARE } from '../key/middleware.metadata.key.ts';
import { Wheat } from './wheat.ts';

export function Middleware() {
  return function (target: Function) {
    Reflect.defineMetadata(MIDDLEWARE, true, target);
    Wheat()(target);
  };
}
