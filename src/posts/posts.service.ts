import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from './posts.entity';
import { CategoryService } from './../category/category.service';
import { TagService } from './../tag/tag.service';
import { CreatePostDto } from './dto/create-posts.dto';

export interface PostsRo {
  list: PostsEntity[];
  count: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
  ) {}

  // 创建文章
  // Partial是ts中的一个内置类型，它可以将一个对象的所有属性转换成可选的。
  async create(user, post: CreatePostDto ): Promise<number> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }

    let { tag, category = 0, status, isRecommend, coverUrl } = post;

    const categoryDoc = await this.categoryService.findById(category);

    // 根据传入的标签id，如 ‘1,2’,获取标签
    const tags = await this.tagService.findByIds(('' + tag).split(','));
    const postParam: Partial<PostsEntity> = {
      ...post,
      isRecommend: isRecommend ? 1 : 0,
      category: categoryDoc,
      tags: tags,
      author: user,
    };

    // 判断状态，为publish则设置发布时间
    if (status === 'publish') {
      Object.assign(postParam, {
        publishTime: new Date(),
      });
    }

    const newPost: PostsEntity = await this.postsRepository.create({
      ...postParam,
    });

    const created = await this.postsRepository.save(newPost);
    return created.id;
  }

  // 获取文章列表
  async findAll(query): Promise<PostsRo> {
    //  QueryBuilder允许使用高效便捷的语法构建sql查询，执行并获得自动转换的实体
    const qb = await this.postsRepository.createQueryBuilder('posts');

    qb.where('1 = 1');
    qb.orderBy('posts.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count: count };
  }

  // 获取指定文章
  async findById(id): Promise<PostsEntity> {
    return await this.postsRepository.findOne({ where: { id } });
  }

  // 更新文章
  async updateById(id, post): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  // 刪除文章
  async remove(id) {
    const existPost = await this.postsRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return await this.postsRepository.remove(existPost);
  }
}
