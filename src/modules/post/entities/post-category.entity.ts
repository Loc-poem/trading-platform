import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { PostCategoryDto } from '../dto/post-category.dto';

@Entity({ name: 'post_category' })
@UseDto(PostCategoryDto)
export class PostCategoryEntity extends AbstractEntity<PostCategoryDto> {
  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'is_public', nullable: true, default: true })
  isPublic: boolean;

  @Column({ name: 'total_post', default: 0, type: 'int' })
  totalPost: number;

  // @OneToMany(() => PostEntity, (post) => post.postCategory, {
  //   nullable: true,
  // })
  // listPost?: PostEntity[];
}
