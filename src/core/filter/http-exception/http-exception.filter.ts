import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 获取请求上下文
    const ctx = host.switchToHttp();
    // 获取请求上下文中的response方法
    const response = ctx.getResponse();
    // 获取异常状态码
    const status = exception.getStatus();

    const exceptionResponse: any = exception.getResponse();
    let validMessage = '';

    if (typeof exceptionResponse === 'object') {
      validMessage =
        typeof exceptionResponse.message === 'string'
          ? exceptionResponse.message
          : exceptionResponse.message[0];
    }

    // 设置错误消息
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;

    const errorResponse = {
      data: {},
      message: validMessage || message,
      code: -1,
    };

    // 设置返回的状态码，请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
