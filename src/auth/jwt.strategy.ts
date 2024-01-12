import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';

/* 
  其实jwt策略主要分两步
  （1）第一步，如何取出token
  （2）根据token拿到用户信息
*/
export class JwtStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET'),
    } as StrategyOptions);
  }

  /* 
   在上面策略中的ExtractJwt提供多种方式从请求中提取JWT
   (1)formHeader 在http请求头中查找JWT
   (2)fromBodyField 在请求的Body字段
   (3)fromAuthHeaderAsBearerToken 在授权标头带有Bearer方案中查询JWT 我们采用的是fromAuthHeaderAsBearerToken
   */

  async validate(user: UserEntity) {
    const existUser = await this.authService.getUser(user);
    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }
    return existUser;
  }
}
