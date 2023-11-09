import { Wheat} from "./wheat.ts";
import {CONTROLLER, Metadata} from "../controller/metadata.ts";

export function Controller(path: string){
    return function(target: Function){

        const metadata: Metadata = {
            path: path
        }
        Reflect.defineMetadata(CONTROLLER, metadata, target)
        Wheat()(target);
    }
}