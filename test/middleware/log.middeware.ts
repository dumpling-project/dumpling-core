import { AbstractMiddleware, Middleware } from '../../src';

@Middleware()
export class LogMiddleware extends AbstractMiddleware {
  public execute(request: Request, response: Response, next: Function) {
    console.log(Request);
    return next();
  }
}
