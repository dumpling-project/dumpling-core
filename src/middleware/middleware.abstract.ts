export abstract class AbstractMiddleware {
  execute(request: Request, response: Response, next: Function): Function {
    return next();
  }
}
