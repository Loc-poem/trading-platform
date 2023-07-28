import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { CoingeckoService } from './coingecko.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [CoingeckoService],
  exports: [CoingeckoService],
})
export class CoingeckoModule {}
