import type { FindOperator } from 'typeorm';

export class QueryPostDto {
  postCategoryId: Uuid;

  title: FindOperator<string>;

  isPublic: boolean;

  authorId: Uuid;

  publicDate;

  id: Uuid;
}
