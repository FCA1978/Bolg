import { PostsService, PostsRo } from './posts.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-posts.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from './../auth/role.guard';

@ApiTags('文章')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 创建文章
   * @param  post
   */
  @ApiOperation({ summary: '创建文章' })
  @ApiBearerAuth()
  @Post()
  @Roles('admin', 'root')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  // CreatePostDto 是在对创建文章的接口传入的参数进行类型说明
  async create(@Body() post: CreatePostDto, @Req() req) {
    return await this.postsService.create(post, req.user);
  }

  /**
   * 获取所有文章
   */
  @ApiOperation({ summary: '获取所有文章' })
  @Get()
  async findAll(@Query() query): Promise<PostsRo> {
    return await this.postsService.findAll(query);
  }

  /**
   * 获取指定文章
   * @param id
   */
  @ApiOperation({ summary: '获取指定文章' })
  @Get(':id')
  async findById(@Param('id') id) {
    return await this.postsService.findById(id);
  }

  /**
   * 更新文章
   * @param id
   * @param post
   */
  @ApiOperation({ summary: '更新文章' })
  @Put(':id')
  async update(@Param('id') id, @Body() post) {
    return await this.postsService.updateById(id, post);
  }

  /**
   * 删除文章
   * @param id
   */
  @ApiOperation({ summary: '删除文章' })
  @Delete(':id')
  async remove(@Param('id') id) {
    return await this.postsService.remove(id);
  }
}
