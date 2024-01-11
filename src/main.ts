/* 应用程序的入口文件 它使用核心函数NestFactory来创建Nest应用程序的实例 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 设置全局路由前缀
  app.setGlobalPrefix('api'); 
  await app.listen(3000);
}
bootstrap();
