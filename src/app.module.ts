import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig from '../config/env';
import { PostsEntity } from './posts/posts.entity';
import { UserEntity } from './user/entities/user.entity';
import { AuthEntity } from './auth/entities/auth.entity';

/* 应用程序的根模块 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

/* 
  AppModule是应用程序的根模块，根模块提供了用来启动应用的引导机制。
  可以包含很多功能模块。
*/

/* 
  .module文件需要使用一个@Module() 装饰器的类。
  装饰器可以理解成一个封装好的函数，其实是一个语法糖
  @Module()装饰器接收四个属性：
    Providers:nest.js注入器实例化的提供者（服务提供者）,处理具体的业务逻辑，各个模块之间可以共享、
    controllers:处理http请求,包括路由控制，向客服端返回相应，将具体业务逻辑委托给providers处理、
    imports：导入模块的列表，如果需要使用其他模块的服务，需要通过这里导入、
    exports：导出服务的列表，供其他模块导入使用。如果希望当前模块下的服务可以被其他模块共享，需要在这里配置导出
*/

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [PostsEntity, UserEntity, AuthEntity], // 数据表实体
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'), // 用户名
        password: configService.get('DB_PASSWORD', '123456'), // 密码
        database: configService.get('DB_DATABASE', 'blog'), //数据库名
        secret:configService.get('SECRET', '123456'),
        timezone: '+08:00', //服务器上配置的时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
      }),
    }),
    PostsModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
