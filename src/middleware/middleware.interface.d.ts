export interface MiddlewareInterface {
  execute(request: Request, response: Response);
}
