import {Wheat} from "../element/wheat.ts";
import {Container} from "typedi";
import {CONTROLLER} from "./metadata.ts";
import {REQUEST_MAPPING_METADATA_KEY} from "./request.mapping.decorator.ts";
import {joinPaths} from "./utils.ts";

@Wheat()
export class FrontController {
    private controllers: Map<String, any> = new Map<String, any>();

    constructor() {
        this.loadControllers();
    }
    private loadControllers() {
        const wheatList = (Container as any).instances;
        console.log(wheatList);

        wheatList.forEach((wheat: any) => {
            const target = wheat.constructor;

            const controllerMetadata = Reflect.getMetadata(CONTROLLER,target);

            if(controllerMetadata){
                // this.controllers.set(controllerMetadata.path, wheat);

                const methods = Object.getOwnPropertyNames(target.prototype);

                methods.forEach(methodName => {
                    const method = target.prototype[methodName];

                    const requestMappingMetadata = Reflect.getMetadata(REQUEST_MAPPING_METADATA_KEY, method);

                    if(requestMappingMetadata){
                        const fullPath = joinPaths(controllerMetadata.path + requestMappingMetadata.path);
                        const key = requestMappingMetadata.method+":"+fullPath;
                        this.controllers.set(key, {method: requestMappingMetadata.method, action: method});
                    }
                })
            }
        });
    }

    public router(request:Request) : Response {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        const fullPath = joinPaths(path)

        const controllerKey = method+":"+fullPath
        const controllerAction = this.controllers.get(controllerKey);

        if(controllerAction){
            return controllerAction.action(request);
        } else {
            return new Response("Not Found", {status: 404});
        }
    }


}