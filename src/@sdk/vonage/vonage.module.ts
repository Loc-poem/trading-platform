import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NationalityEntity } from '../../modules/user/entities/nationality.entity';
import { VonageService } from './vonage.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([NationalityEntity])],
  providers: [VonageService],
  exports: [VonageService],
})
export class VonageModule {}
