import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostEntity } from './entities/post.entity';
import { PostCategoryEntity } from './entities/post-category.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostCategoryEntity])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
