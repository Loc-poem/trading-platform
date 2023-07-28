import type { FindOperator } from 'typeorm';

export class QueryCategoryDto {
  isPublic: boolean;

  title: FindOperator<string>;
}
