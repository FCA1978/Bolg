import { UserEntity } from 'src/user/entities/user.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

// 文章实体
@Entity('posts')
export class PostsEntity {
  // 标记为主列，值自动生成
  @PrimaryGeneratedColumn()
  id: number;

  //文章标题
  @Column({ length: 50 })
  title: string;

  //作者
  @ManyToOne(() => UserEntity, (user) => user.nickname)
  author: UserEntity;

  // 分类
  @Exclude()
  @ManyToOne(() => CategoryEntity, (category) => category.posts)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  // 标签
  @ManyToMany(() => TagEntity, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tag',
    joinColumns: [{ name: 'post_id' }],
    inverseJoinColumns: [{ name: 'tag_id' }],
  })
  tags: TagEntity[];

  @Column('text')
  content: string;

  // markdown转html 自动生成
  @Column({ type: 'mediumtext', default: null, name: 'content_html' })
  contentHtml: string;

  // 摘要，自动生成
  @Column({ type: 'text', default: null })
  summary: string;

  // 封面图
  @Column({ default: null, name: 'cover_url' })
  coverUrl: string;

  // 阅读量
  @Column({ type: 'int', default: 0 })
  count: number;

  // 点赞量
  @Column({ type: 'int', default: 0, name: 'like_count' })
  likeCount: number;

  // 推荐显示
  @Column({ type: 'tinyint', default: 0, name: 'is_recommend' })
  isRecommend: number;

  // 文章状态
  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string;

  @Column({ default: '' })
  thumb_url: string;

  @Column('tinyint')
  type: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}
