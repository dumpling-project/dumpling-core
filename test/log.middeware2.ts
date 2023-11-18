import { AbstractMiddleware, Middleware } from '../src';

@Middleware()
export class LogMiddleware2 extends AbstractMiddleware {
  public execute(request: Request, response: Response, next: Function) {
    console.log(2);
    return next();
  }
}
