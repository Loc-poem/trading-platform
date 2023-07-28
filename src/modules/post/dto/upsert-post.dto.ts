import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpsertPostDto {
  @ApiProperty({ required: true })
  @IsString()
  content: string;

  @ApiProperty({ required: true })
  @IsString()
  setPublic: string;

  @ApiProperty({ required: false })
  isPublic: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  publicDate?: Date;

  @ApiProperty({ required: true })
  @IsString()
  title: string;

  // @ApiProperty({ required: true })
  // @IsUUID()
  // postCategoryId?: Uuid;
  //
  // @ApiProperty({ required: false })
  // postCategory: PostCategoryEntity;

  @ApiProperty({ required: false })
  bannerUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;
}
