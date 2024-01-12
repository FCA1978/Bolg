import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  username: string; //用户名

  @Column({ length: 100 })
  nickname: string; //昵称

  @Exclude() //序列化
  @Column()
  password: string; //密码

  @Column()
  avatar: string; //头像

  @Column()
  email: string; //邮箱

  @Column('simple-enum', { enum: ['root', 'author', 'visitor'] })
  role: string; //用户角色

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await bcrypt.hashSync(this.password, 10);
  }
}
