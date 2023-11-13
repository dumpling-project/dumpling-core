import { Middleware, MiddlewareInterface } from '../src';

@Middleware()
export class LogMiddleware implements MiddlewareInterface {
  public execute(request: Request, response: Response, next: Function) {
    console.log(Request);
    return next();
  }
}
