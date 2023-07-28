import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { AdminDto } from '../../admin/dto/admin.dto';
import type { PostEntity } from '../entities/post.entity';

export class PostDto extends AbstractDto {
  content: string;

  isPublic: boolean;

  author: AdminDto;

  authorId: Uuid;

  publicDate: Date;

  bannerUrl: string;

  title: string;

  description: string;

  constructor(post: PostEntity) {
    super(post);
    this.content = post.content;
    this.isPublic = post.isPublic;

    if (post.author) {
      this.author = post.author.toDto();
    }

    this.authorId = post.authorId;
    this.publicDate = post.publicDate;
    this.bannerUrl = post.bannerUrl;
    this.title = post.title;
    this.description = post.description;
  }
}
