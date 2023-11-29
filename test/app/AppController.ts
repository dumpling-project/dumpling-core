import { Body, Controller, Get, Param, Post, Query, Req, UseMiddleware } from '../../src';
import { AppService } from './AppService.ts';
import { LogMiddleware } from '../middleware/log.middeware.ts';
import { LogMiddleware2 } from '../middleware/log.middeware2.ts';
import { ParamToIntPipe } from '../pipe/param.to.int.pipe.ts';
@UseMiddleware(LogMiddleware2)
@Controller('/test')
export class AppController {
  constructor(private appService: AppService) {}
  @Get('/hello/:name')
  public async hello(@Param('name', [ParamToIntPipe]) name: string, @Query('id') id: string, @Req() req: Request) {
    console.log(name);
    console.log(typeof name);

    const text = this.appService.hello(id);
    return new Response(text);
  }

  // @UseMiddleware(LogMiddleware)
  // @Get('/hello')
  // public async helloGet(@Body() body: any) {
  //   console.log('helloGet');
  //   return new Response('GetHello');
  // }

  //
  @Post('/hello')
  public async postHello(@Body('id') body: any) {
    console.log(body);

    return new Response('Post Hello');
  }
}
