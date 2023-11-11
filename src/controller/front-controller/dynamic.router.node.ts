import { HttpMethodType } from '../../global/http/http.method.ts';

export class DynamicRouterNode {
  public children: Map<string, DynamicRouterNode> = new Map<string, DynamicRouterNode>();
  public action: Map<HttpMethodType, Function> = new Map<HttpMethodType, Function>();

  constructor(public segment: string) {}
}