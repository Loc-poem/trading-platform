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
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { EditPaymentDto } from './dto/edit-payment.dto';
import { ListPaymentPageOptionDto } from './dto/list-payment-page-option.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Transactional()
  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: ' create payment for user' })
  createPayment(@AuthUser() user: UserEntity, @Body() data: CreatePaymentDto) {
    return this.paymentService.createPayment(user, data);
  }

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get list payment method of user' })
  getListPayment(
    @AuthUser() user: UserEntity,
    @Query() filter: ListPaymentPageOptionDto,
  ) {
    return this.paymentService.getListPayment(user, filter);
  }

  @Transactional()
  @Put()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit payment method of user' })
  editPaymentMethod(
    @AuthUser() user: UserEntity,
    @Body() data: EditPaymentDto,
  ) {
    return this.paymentService.editPayment(user, data);
  }

  @Delete(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit payment method of user' })
  deletePayment(@AuthUser() user: UserEntity, @Param('id') id: Uuid) {
    return this.paymentService.deletePayment(user, id);
  }
}
