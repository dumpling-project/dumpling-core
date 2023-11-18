import { Body, Controller, Get, Param, Post, Query, Req, UseMiddleware } from '../src';
import { AppService } from './AppService.ts';
import { LogMiddleware } from './log.middeware.ts';
import { LogMiddleware2 } from './log.middeware2.ts';
@UseMiddleware(LogMiddleware2)
@Controller('/test')
export class AppController {
  constructor(private appService: AppService) {}
  // @Get('/hello/:name')
  // public async hello(@Param('name') name: string, @Query('age') age: string) {
  //   const text = this.appService.hello(name);
  //   return new Response(text);
  // }

  @UseMiddleware(LogMiddleware)
  @Get('/hello')
  public async helloGet() {
    console.log('helloGet');
    return new Response('GetHello');
  }

  //
  // @Post('/hello')
  // public async postHello(@Body() body: any, @Req() request: Request) {
  //   console.log(body);
  //
  //   return new Response('Post Hello');
  // }
}
