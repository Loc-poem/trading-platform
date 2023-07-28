import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UpdateDto } from '../../common/dto/update.dto';
import { storage } from '../../common/storage.config';
import { storagePath } from '../../common/store.const';
import { RoleType } from '../../constants';
import { ApiFile, Auth, AuthUser } from '../../decorators';
import { IFile } from '../../interfaces';
import { UserEntity } from '../user/entities/user.entity';
import { BuyerConfirmPayDto } from './dto/buyer-confirm-pay.dto';
import { CreateProofTransferredMoneyDto } from './dto/create-proof-transferred-money.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchasePageOptionDto } from './dto/purchase-page-option.dto';
import { ResentOtpPurchaseDto } from './dto/resent-otp-purchase.dto';
import { VerifyOtpPurchaseDto } from './dto/verify-otp-purchase.dto';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
@ApiTags('Purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'create transaction buy of buyer' })
  createPurchase(
    @AuthUser() user: UserEntity,
    @Body() data: CreatePurchaseDto,
  ) {
    return this.purchaseService.createPurchase(user, data);
  }

  @Post('verify-otp')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'verify otp to confirm buy transaction' })
  verifyOtp(@AuthUser() user: UserEntity, @Body() data: VerifyOtpPurchaseDto) {
    return this.purchaseService.verifyOtp(user, data);
  }

  @Post('proof-transferred-money')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'create proof transferred money for pending purchase blocked by disabled user',
  })
  upsertProofTransferredMoney(
    @AuthUser() user: UserEntity,
    @Body() data: CreateProofTransferredMoneyDto,
  ) {
    return this.purchaseService.upsertProofTransferredMoney(user, data);
  }

  @Post('proof-transferred-image/:id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiOperation({ summary: 'upload image proof transferred image' })
  @ApiFile(
    { name: 'proof' },
    { storage: storage(storagePath.proofTransferredMoney) },
  )
  uploadProofTransferredImage(
    @AuthUser() user: UserEntity,
    @Param('id') id: Uuid,
    @UploadedFile() file: IFile,
  ) {
    return this.purchaseService.uploadProofTransferredImage(user, id, file);
  }

  @Put('resend-otp-code')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'resent otp code to confirm buy transaction' })
  resentOtpCode(
    @AuthUser() user: UserEntity,
    @Body() data: ResentOtpPurchaseDto,
  ) {
    return this.purchaseService.resentOtpCode(user, data);
  }

  @Put('buyer-cancel-pay/:id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'update status for purchase when buyer cancel buy',
  })
  buyerCancelPurchase(@AuthUser() user: UserEntity, @Param('id') id: Uuid) {
    return this.purchaseService.buyerCancelPurchase(user, id);
  }

  @Put('buyer-confirm-pay')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'update status for purchase when buyer confirm buy',
  })
  buyerConfirmPay(
    @AuthUser() user: UserEntity,
    @Body() data: BuyerConfirmPayDto,
  ) {
    return this.purchaseService.buyerConfirmBuy(user, data);
  }

  @Put('seller-confirm-pay')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'update status for purchase when seller confirm buy',
  })
  sellerConfirmBuy(@AuthUser() user: UserEntity, @Body() data: UpdateDto) {
    return this.purchaseService.sellerConfirmBuy(user, data);
  }

  @Get('sell')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get list purchase that user sell' })
  getListPurchaseSell(
    @AuthUser() user: UserEntity,
    @Query() filter: PurchasePageOptionDto,
  ) {
    return this.purchaseService.getListPurchaseSell(user, filter);
  }

  @Get('buy')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get list purchase that user buy' })
  getListPurchaseBuy(
    @AuthUser() user: UserEntity,
    @Query() filter: PurchasePageOptionDto,
  ) {
    return this.purchaseService.getListPurchaseBuy(user, filter);
  }

  @Get('buyer/detail/:id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get detail purchase that user buy' })
  buyerGetDetail(@AuthUser() user: UserEntity, @Param('id') id: Uuid) {
    return this.purchaseService.buyerGetDetail(user, id);
  }

  @Get('seller/detail/:id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get detail purchase that user buy' })
  sellerGetDetail(@AuthUser() user: UserEntity, @Param('id') id: Uuid) {
    return this.purchaseService.sellerGetDetail(user, id);
  }
}
