import {Controller, Get} from "../src";
import {AppService} from "./AppService.ts";

@Controller("/test")
export class AppController {

    constructor(private appService: AppService) {}
    @Get("/hello")
    public hello(){
        const text =  this.appService.hello();
        return new Response(text);
    }
}