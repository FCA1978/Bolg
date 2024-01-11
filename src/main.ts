/* 应用程序的入口文件 它使用核心函数NestFactory来创建Nest应用程序的实例 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 设置全局路由前缀
  app.setGlobalPrefix('api');
  // 全局注册过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 校验管道
  app.useGlobalPipes(new ValidationPipe());
  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('Blog')
    .setDescription('个人博客接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
