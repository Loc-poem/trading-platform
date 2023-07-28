import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { PostDto } from '../dto/post.dto';

@Entity({ name: 'post' })
@UseDto(PostDto)
export class PostEntity extends AbstractEntity<PostDto> {
  @Column({ name: 'content' })
  content: string;

  @Column({
    nullable: true,
    default: false,
  })
  isPublic: boolean;

  @ManyToOne(() => AdminEntity)
  @JoinColumn({ name: 'author_id' })
  author?: AdminEntity;

  @Column({ name: 'author_id' })
  authorId: Uuid;

  @Column({
    nullable: true,
  })
  publicDate: Date;

  @Column({ name: 'banner_url', nullable: true })
  bannerUrl: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description', length: 1000, nullable: true })
  description: string;

  // @ManyToOne(
  //   () => PostCategoryEntity,
  //   (postCategory) => postCategory.listPost,
  //   {
  //     onDelete: 'CASCADE',
  //   },
  // )
  // @JoinColumn({ name: 'post_category_id' })
  // postCategory?: PostCategoryEntity;
  //
  // @Column({ name: 'post_category_id' })
  // postCategoryId: Uuid;
}
