import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NationalityEntity } from '../user/entities/nationality.entity';
import { LookupTableController } from './lookup-table.controller';
import { LookupTableService } from './lookup-table.service';

@Module({
  imports: [TypeOrmModule.forFeature([NationalityEntity])],
  controllers: [LookupTableController],
  providers: [LookupTableService],
})
export class LookupTableModule {}
