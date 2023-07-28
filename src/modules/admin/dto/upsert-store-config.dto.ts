import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpsertStoreConfigDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logo: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  bannerUrl?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundColor: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  headerColor: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  footerColor: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundBodyColor: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  primaryColor: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  facebookLink: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  twitterLink: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  whatsappLink: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  instagramLink: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  youtubeLink: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  telegramLink: string;
}
