import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { storage } from '../../common/storage.config';
import { storagePath } from '../../common/store.const';
import { ApiFile } from '../../decorators';
import { Admin } from '../../decorators/admin.decorator';
import { AuthAdmin } from '../../decorators/auth-admin.decorator';
import { IFile } from '../../interfaces';
import { AdminEntity } from '../admin/entities/admin.entity';
import { AdminRole } from '../admin/enums/admin.enums';
import { PostPageOptionDto } from './dto/post-page-option.dto';
import { UpsertPostDto } from './dto/upsert-post.dto';
import { PostService } from './post.service';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @Post('category')
  // @HttpCode(HttpStatus.OK)
  // @Admin([AdminRole.SubAdmin])
  // @ApiOperation({ summary: 'create post category' })
  // createCategory(@Body() data: UpsertPostCategoryDto) {
  //   return this.postService.upsertPostCategory(data);
  // }

  // @Put('category/:id')
  // @HttpCode(HttpStatus.OK)
  // @Admin([AdminRole.SubAdmin])
  // @ApiOperation({ summary: 'update post category' })
  // updateCategory(@Body() data: UpsertPostCategoryDto, @Param('id') id: Uuid) {
  //   return this.postService.upsertPostCategory(data, id);
  // }

  // @Get('category')
  // @HttpCode(HttpStatus.OK)
  // @Admin([AdminRole.SubAdmin])
  // @ApiOperation({ summary: 'admin get list post category' })
  // adminGetListCategory(@Query() filter: CategoryPageOptionDto) {
  //   return this.postService.getListCategory(filter);
  // }

  // @Get('category/user')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'user get list post category' })
  // userGetListCategory(@Query() filter: CategoryPageOptionDto) {
  //   filter.isPublic = true;

  //   return this.postService.getListCategory(filter);
  // }

  // @Delete('category/:id')
  // @HttpCode(HttpStatus.OK)
  // @Admin([AdminRole.SubAdmin])
  // @ApiOperation({ summary: 'admin get list post category' })
  // deleteCategory(@Param('id') id: Uuid) {
  //   return this.postService.deleteCategory(id);
  //}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'create post' })
  @ApiFile({ name: 'banner' }, { storage: storage(storagePath.postBanner) })
  createPost(
    @AuthAdmin() admin: AdminEntity,
    @Body() data: UpsertPostDto,
    @UploadedFile() file?: IFile,
  ) {
    return this.postService.upsertPost(admin, data, file);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'update post' })
  @ApiFile({ name: 'banner' }, { storage: storage(storagePath.postBanner) })
  updatePost(
    @AuthAdmin() admin: AdminEntity,
    @Body() data: UpsertPostDto,
    @UploadedFile() file?: IFile,
    @Param('id') id?: Uuid,
  ) {
    return this.postService.upsertPost(admin, data, file, id);
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'user get list post' })
  userGetListPost(@Query() filter: PostPageOptionDto) {
    return this.postService.getListPost(filter, true);
  }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'admin get list post' })
  adminGetListPost(@Query() filter: PostPageOptionDto) {
    return this.postService.getListPost(filter, false);
  }

  @Post('image')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'upload image for post' })
  @ApiFile({ name: 'post-image' }, { storage: storage(storagePath.postImage) })
  uploadImage(@UploadedFile() file: IFile) {
    return this.postService.uploadImage(file);
  }

  @Get('detail/admin/:id')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'admin get detail post' })
  adminGetDetailPost(@Param('id') id: Uuid) {
    return this.postService.getDetailPost(id, false);
  }

  @Get('detail/user/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'user get detail post' })
  userGetDetailPost(@Param('id') id: Uuid) {
    return this.postService.getDetailPost(id, true);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'admin delete post' })
  deletePost(@Param('id') id: Uuid) {
    return this.postService.deletePost(id);
  }
}
