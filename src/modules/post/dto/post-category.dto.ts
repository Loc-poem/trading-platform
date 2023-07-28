import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { PostCategoryEntity } from '../entities/post-category.entity';

export class PostCategoryDto extends AbstractDto {
  title: string;

  isPublic: boolean;

  totalPost: number;

  constructor(postCategory: PostCategoryEntity) {
    super(postCategory);
    this.title = postCategory.title;
    this.isPublic = postCategory.isPublic;
    this.totalPost = postCategory.totalPost;
  }
}
