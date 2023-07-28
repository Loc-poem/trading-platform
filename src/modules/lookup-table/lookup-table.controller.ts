import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { NationalityDto } from '../user/dtos/nationality.dto';
import { LookupTableService } from './lookup-table.service';

@Controller('lookup-table')
@ApiTags('Lookup Table')
export class LookupTableController {
  constructor(private readonly lookupTableService: LookupTableService) {}

  @Get('nationalities')
  @HttpCode(HttpStatus.OK)
  getNationalitiesList(): Promise<NationalityDto[]> {
    return this.lookupTableService.getNationalitiesList();
  }
}
