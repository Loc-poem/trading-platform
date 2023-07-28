import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Like, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { ApiError } from '../../common/response/api-error';
import { storageExtUrlRemove } from '../../common/store.const';
import { convertStringToBoolean } from '../../common/utils';
import { IFile } from '../../interfaces';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { AdminEntity } from '../admin/entities/admin.entity';
import type { CategoryPageOptionDto } from './dto/category-page-option.dto';
import type { PostPageOptionDto } from './dto/post-page-option.dto';
import type { QueryCategoryDto } from './dto/query-category.dto';
import type { QueryPostDto } from './dto/query-post.dto';
import { UpsertPostDto } from './dto/upsert-post.dto';
import type { UpsertPostCategoryDto } from './dto/upsert-post-category.dto';
import { PostEntity } from './entities/post.entity';
import { PostCategoryEntity } from './entities/post-category.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(PostCategoryEntity)
    private readonly postCategoryRepository: Repository<PostCategoryEntity>,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  async upsertPostCategory(data: UpsertPostCategoryDto, id?: Uuid) {
    if (id) {
      const resultUpdate = await this.postCategoryRepository.update(
        {
          id,
        },
        {
          ...data,
        },
      );

      if (resultUpdate.affected !== 0) {
        const category = await this.postCategoryRepository.findOne({
          where: { id },
        });

        if (!category) {
          throw new ApiError('Invalid data', 'E-1');
        }

        return category.toDto();
      }

      throw new ApiError('Invalid data', 'E-1');
    }

    const category = this.postCategoryRepository.create({
      ...data,
    });

    await this.postCategoryRepository.save(category);

    return category.toDto();
  }

  async getListCategory(filter: CategoryPageOptionDto) {
    const { isPublic, title } = filter;
    const where = {} as QueryCategoryDto;

    if (isPublic) {
      where.isPublic = convertStringToBoolean(isPublic);
    }

    if (title) {
      where.title = Like(`%${title}%`);
    }

    const [listCategory, total] =
      await this.postCategoryRepository.findAndCount({
        where,
        order: {
          createdAt: filter.order,
        },
      });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listCategory.toPageDto(pageMetaDto);
  }

  async deleteCategory(id: Uuid) {
    const result = await this.postCategoryRepository.delete({
      id,
    });

    return result.affected !== 0;
  }

  @Transactional()
  async upsertPost(
    admin: AdminEntity,
    data: UpsertPostDto,
    file?: IFile,
    id?: Uuid,
  ) {
    const { setPublic, ...dataCreate } = data;

    if (file) {
      dataCreate.bannerUrl = file.path.replace(storageExtUrlRemove, '');
    }

    if (!dataCreate.publicDate) {
      dataCreate.publicDate = new Date();
    }

    dataCreate.isPublic = convertStringToBoolean(setPublic);

    if (id) {
      await this.postRepository.update(
        {
          id,
        },
        {
          ...dataCreate,
        },
      );

      const post = await this.postRepository.findOne({
        where: {
          id,
        },
      });

      if (!post) {
        throw new ApiError('Invalid data', 'E-1');
      }

      return post.toDto();
    }

    const post = this.postRepository.create({
      ...dataCreate,
      author: admin,
    });

    await this.postRepository.save(post);

    return post.toDto();
  }

  async getListPost(filter: PostPageOptionDto, fromUser?: boolean) {
    const { postCategoryId, title, isPublic, authorId } = filter;
    const where = {} as QueryPostDto;

    if (postCategoryId) {
      where.postCategoryId = postCategoryId;
    }

    if (title) {
      where.title = Like(`%${title}%`);
    }

    if (isPublic) {
      where.isPublic = convertStringToBoolean(isPublic);
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (!fromUser) {
      where.isPublic = true;
      where.publicDate = LessThanOrEqual(new Date());
    }

    const [listPost, total] = await this.postRepository.findAndCount({
      where,
      relations: fromUser ? [] : ['author'],
      order: {
        createdAt: filter.order,
      },
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listPost.toPageDto(pageMetaDto);
  }

  async getDetailPost(id: Uuid, fromUser: boolean) {
    const where = {} as QueryPostDto;
    where.id = id;

    if (fromUser) {
      where.isPublic = true;
      where.publicDate = LessThanOrEqual(new Date());
    }

    const postDetail = await this.postRepository.findOne({
      where,
      relations: fromUser ? [] : ['author'],
    });

    if (!postDetail) {
      throw new ApiError('Invalid data', 'E-1');
    }

    return postDetail.toDto();
  }

  uploadImage(file: IFile) {
    return `${this.apiConfigService.appConfig.apiDomain}${file.path.replace(
      storageExtUrlRemove,
      '',
    )}`;
  }

  async deletePost(id: Uuid) {
    const result = await this.postRepository.delete({ id });

    return result.affected !== 0;
  }
}
