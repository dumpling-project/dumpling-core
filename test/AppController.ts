import { Controller, Get, Param, Query } from '../src';
import { AppService } from './AppService.ts';

@Controller('/test')
export class AppController {
  constructor(private appService: AppService) {}
  @Get('/hello/:name')
  public async hello(@Param('name') name: string, @Query('age') age: string) {
    console.log(name);
    console.log(age);
    const text = this.appService.hello(name);
    return new Response(text);
  }

  @Get('/hello')
  public async hello2() {
    const text = 'Hello2@@@@@';
    return new Response(text);
  }
}
