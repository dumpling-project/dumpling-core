import { Controller, Get, Param } from '../src';
import { AppService } from './AppService.ts';

@Controller('/test')
export class AppController {
  constructor(private appService: AppService) {}
  @Get('/hello/:name')
  public async hello() {
    const text = this.appService.hello('33233232');
    return new Response(text);
  }

  @Get('/hello')
  public async hello2() {
    const text = 'Hello2@@@@@';
    return new Response(text);
  }
}
