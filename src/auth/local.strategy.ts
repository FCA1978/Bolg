import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { compareSync } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IStrategyOptions, Strategy } from 'passport-local';

export class LocalStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .getOne();

    if (!user) {
      throw new BadRequestException('用户名不正确！');
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码错误！');
    }

    return user;
  }
}
