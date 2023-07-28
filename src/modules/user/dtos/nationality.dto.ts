import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { NationalityEntity } from '../entities/nationality.entity';

export class NationalityDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  code: string;

  @ApiPropertyOptional()
  phoneCode: string;

  @ApiPropertyOptional()
  countryName: string;

  constructor(nationality: NationalityEntity) {
    super(nationality);
    this.name = nationality.name;
    this.code = nationality.code;
    this.phoneCode = nationality.phoneCode;
    this.countryName = nationality.countryName;
  }
}
