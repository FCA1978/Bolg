/* 单个路由的基本控制器 */
import { Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

/* 
  使用@Controller装饰器来定义控制器，
  @Get是请求方法的装饰器，
  对getHello方式进行修饰，
  表示这个方法会被Get请求调用
 */
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /* 
  @Get、@Post、@Put等众多用于Http方法处理装饰器，
  经过他们装饰的方法，可以对相应的Http请求进行相应
   */
  @Get('list')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('list')
  create(): string {
    return this.appService.getHello();
  }

  // 通配符路径(?+* 三种通配符)
  // 可以匹配到get请求，http:/localhost:9080/app_user_xxx
  @Get('user_*')
  getUser() {
    return 'getUser';
  }

  // 带参数路径
  //可以匹配到put请求，http://localhost:9080/app/list/xxxx
  @Put('list/:id')
  update() {
    return 'update';
  }

  // 如果在匹配过程中，发现@Put("list/:id")已经满足了，就不回继续往下匹配了，所以@Put("list/user")装饰的方法应该写在它之前
  @Put('list/user')
  updateUser() {
    return { userId: 1 };
  }
}
