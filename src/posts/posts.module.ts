import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './../auth/auth.module';
import { CategoryModule } from './../category/category.module';
import { TagModule } from './../tag/tag.module';

import { PostsController } from './posts.controller';

import { PostsEntity } from './posts.entity';
import { CategoryEntity } from './../category/entities/category.entity';
import { TagEntity } from './../tag/entities/tag.entity';

import { PostsService } from './posts.service';
import { CategoryService } from './../category/category.service';
import { TagService } from './../tag/tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity, CategoryEntity, TagEntity]),
    AuthModule,
    CategoryModule,
    TagModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, CategoryService, TagService],
})
export class PostsModule {}
