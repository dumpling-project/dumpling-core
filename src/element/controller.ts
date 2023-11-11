import { Wheat} from "./wheat.ts";
import {CONTROLLER, ControllerMetadataType} from "../key/controller.metadata.key.ts";


export function Controller(path: string){
    return function(target: Function){

        const metadata: ControllerMetadataType = {
            path: path
        }
        Reflect.defineMetadata(CONTROLLER, metadata, target)
        Wheat()(target);
    }
}