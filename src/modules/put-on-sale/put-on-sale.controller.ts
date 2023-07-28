import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/entities/user.entity';
import { CancelPutOnSaleDto } from './dto/cancel-put-on-sale.dto';
import { CreatePutOnSaleDto } from './dto/create-put-on-sale.dto';
import { PutOnSalePageOptionDto } from './dto/put-on-sale-page-option.dto';
import { UpdatePutOnSaleDto } from './dto/update-put-on-sale.dto';
import { PutOnSaleService } from './put-on-sale.service';

@Controller('put-on-sale')
@ApiTags('Put On Sale')
export class PutOnSaleController {
  constructor(private readonly putOnSaleService: PutOnSaleService) {}

  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'create put on sale' })
  createPutOnSale(
    @AuthUser() user: UserEntity,
    @Body() data: CreatePutOnSaleDto,
  ) {
    return this.putOnSaleService.createPutOnSaleTemp(user, data);
  }

  @Put('cancel/:id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'cancel put on sale' })
  cancelPutOnSale(
    @AuthUser() user: UserEntity,
    @Param('id') id: Uuid,
    @Body() data: CancelPutOnSaleDto,
  ) {
    return this.putOnSaleService.cancelPutOnSale(user, id, data);
  }

  @Put('tx-id-cancel')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update txId for cancel put on sale' })
  updateTxIdCancel(
    @AuthUser() user: UserEntity,
    @Body() data: UpdatePutOnSaleDto,
  ) {
    return this.putOnSaleService.updateTxIdCancel(user, data);
  }

  @Put()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update txId for put on sale temp' })
  updatePutOnSaleTemp(
    @AuthUser() user: UserEntity,
    @Body() data: UpdatePutOnSaleDto,
  ) {
    return this.putOnSaleService.updatePutOnSaleTemp(user, data);
  }

  @Delete('reject/:id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'reject put on sale temp' })
  rejectPutOnSale(@AuthUser() user: UserEntity, @Param('id') id: Uuid) {
    return this.putOnSaleService.rejectPutOnSale(user, id);
  }

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get list put on sale of user' })
  getListPutOnSaleOfUser(
    @AuthUser() user: UserEntity,
    @Query() filter: PutOnSalePageOptionDto,
  ) {
    return this.putOnSaleService.getListPutOnSaleOfUser(user, filter);
  }

  @Get('list-on-sale')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get list put on sale active' })
  listOnSale(@Query() filter: PutOnSalePageOptionDto) {
    return this.putOnSaleService.getListOnSale(filter);
  }
}
