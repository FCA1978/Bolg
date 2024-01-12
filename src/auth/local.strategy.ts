import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { compareSync } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IStrategyOptions, Strategy } from 'passport-local';

// 继承@nestjs/passport提供的PassportStrategy类，接受参数Strategy
export class LocalStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    // 调用super传递策略参数，这里如果传入的就是username和password，可以不用写，使用默认的参数
    // 如果是用类似邮箱进行验证，传入的参数是email，那usernameField对应的value就是email
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  // validate是LocalStrategy的内置方法，主要就是实现用户查询以及密码对比
  // 因为存的密码是加密后的，没办法直接对比用户名密码，只能先根据用户名查出用户，再比对密码
  // 这里还有一个注意点，通过addSelect添加password查询，否则无法做密码比对
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
