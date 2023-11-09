import {FrontController} from "./controller/front.controller.ts";
import console from "console";
import * as path from "path";
import * as fs from "fs";
import {WHEAT} from "./element/wheat.ts";
import {DumplingContainer} from "./di/dumpling.container.ts";
export class Dumpling {
    constructor() {
    }

    public bootstrap(): void {

        const projectDir = this.getFilesFromDir(path.join(import.meta.dir,'..','test'));
        const registerPromise =  this.findWheat(projectDir);
        registerPromise.then((wheatList)=>{

            const flatWheatList = wheatList.flat();
            const dumplingContainer = DumplingContainer.instance;

            this.resolveDi(flatWheatList, dumplingContainer);

            this.run();
        })

    }

    public run(): void {


        Bun.serve({
            port:4000,
            fetch(request:Request){
                console.log(request);
                return new Response("Hello World");
            }
        })
    }

    private getFilesFromDir(dir: string): string[] {
        const subDirs = fs.readdirSync(dir, { withFileTypes: true });
        const files = subDirs.map((subDir) => {
            const res = path.resolve(dir, subDir.name);
            return subDir.isDirectory() ? this.getFilesFromDir(res) : res;
        });

        return Array.prototype.concat(...files);
    }

    private findWheat(files: string[]){

        const imports = files.map(file=>{
            if(file.endsWith(".ts") && !file.endsWith(".d.ts")){

                return import(file).then((module)=> {

                    const wheatList = Object.keys(module).map(key => {
                        const exportedEntity = module[key];
                        if (typeof exportedEntity === 'function') {
                            const isWheat = Reflect.getMetadata(WHEAT, exportedEntity);
                            if (isWheat) {
                                return exportedEntity;
                            }
                        }
                    });
                    return wheatList
                });
            }
        })

        return Promise.all(imports);
    }


    private resolveDi (wheatList: any[], dumplingContainer:DumplingContainer){
        wheatList.forEach(wheat=>{
            dumplingContainer.addWheatDependency(wheat, Reflect.getMetadata('design:paramtypes', wheat));
        })

        dumplingContainer.resolveDi();
        dumplingContainer.initWheat();


    }




}


