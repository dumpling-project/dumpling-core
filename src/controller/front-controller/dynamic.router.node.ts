import * as http from "http";
import {HttpMethod} from "../../global/http/http.method.ts";

export class DynamicRouterNode {
    public children: Map<string,DynamicRouterNode> = new Map<string,DynamicRouterNode>();
    public action: Map<HttpMethod, Function> = new Map<HttpMethod, Function>

    constructor(public segment: string) {}
}