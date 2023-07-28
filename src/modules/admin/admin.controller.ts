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
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { storage } from '../../common/storage.config';
import { storagePath } from '../../common/store.const';
import { ApiFile } from '../../decorators';
import { Admin } from '../../decorators/admin.decorator';
import { AuthAdmin } from '../../decorators/auth-admin.decorator';
import { IFile } from '../../interfaces';
import { AuthService } from '../auth/auth.service';
import { LoginPayloadDto } from '../auth/dto/LoginPayloadDto';
import { PutOnSalePageOptionDto } from '../put-on-sale/dto/put-on-sale-page-option.dto';
import { AdminService } from './admin.service';
import { AdminPageOptionsDto } from './dto/admin-page-options.dto';
import { BannerPageOptionDto } from './dto/banner-page-option.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateStoreFeeDto } from './dto/create-store-fee.dto';
import { CreateSubAdminDto } from './dto/create-sub-admin.dto';
import { ImportTokenDto } from './dto/import-token.dto';
import { LoginAdminDto } from './dto/login.dto';
import { PendingPurchasePageOptionDto } from './dto/pending-purchase-page-option.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { ServiceFeeTransactionPageOptionDto } from './dto/service-fee-transaction-page-option.dto';
import { StoreFeePageOptionDto } from './dto/store-fee-page-option.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { UpdateUserActiveDto } from './dto/update-user-active.dto';
import { UpsertReferralProgramConfigDto } from './dto/upsert-referral-program-config.dto';
import { UpsertStoreConfigDto } from './dto/upsert-store-config.dto';
import { UserPageOptionDto } from './dto/user-page-option.dto';
import { AdminEntity } from './entities/admin.entity';
import { AdminRole } from './enums/admin.enums';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'login admin' })
  async loginAdmin(@Body() data: LoginAdminDto) {
    const admin = await this.adminService.login(data);

    const token = await this.authService.createAccessToken({
      userId: admin.id,
      role: admin.role,
    });

    return new LoginPayloadDto(admin, token);
  }

  @Post('sub-admin')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SuperAdmin])
  @ApiOperation({ summary: 'create sub admin' })
  createSubAdmin(@Body() data: CreateSubAdminDto) {
    return this.adminService.createSubAdmin(data);
  }

  @Delete('sub-admin/:id')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SuperAdmin])
  @ApiOperation({ summary: 'delete sub admin' })
  deleteSubAdmin(@Param('id') id: Uuid) {
    return this.adminService.deleteSubAdmin(id);
  }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SuperAdmin])
  @ApiOperation({ summary: 'get list sub admin' })
  getListAdmin(@Query() filter: AdminPageOptionsDto) {
    return this.adminService.getListAdmin(filter);
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'get list user' })
  getListUser(@Query() filter: UserPageOptionDto) {
    return this.adminService.getListUser(filter);
  }

  @Put('password')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'change password' })
  changePassword(
    @Body() data: ChangePasswordDto,
    @AuthAdmin() admin: AdminEntity,
  ) {
    return this.adminService.changePassword(admin, data);
  }

  @Put('user-active')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'update is active of user' })
  updateUserActive(@Body() data: UpdateUserActiveDto) {
    return this.adminService.updateUserActive(data);
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'import token' })
  @ApiFile({ name: 'token-image' }, { storage: storage(storagePath.token) })
  importToken(@Body() data: ImportTokenDto, @UploadedFile() file?: IFile) {
    return this.adminService.importToken(data, file);
  }

  @Put('token/:id')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'disable token' })
  disableToken(@Param('id') id: Uuid, @Body() data: UpdateTokenDto) {
    return this.adminService.updateToken(id, data);
  }

  @Post('store-fee')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'create store fee' })
  createStoreFee(@Body() data: CreateStoreFeeDto) {
    return this.adminService.upsertStoreFee(data);
  }

  // @Put('store-fee')
  // @HttpCode(HttpStatus.OK)
  // @Admin([AdminRole.SubAdmin])
  // @ApiOperation({ summary: 'update store fee' })
  // updateStoreFee(@Body() data: UpdateStoreFeeDto) {
  //   return this.adminService.updateStoreFee(data);
  // }

  @Delete('store-fee/:id')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'delete store fee' })
  deleteStoreFee(@Param('id') id: Uuid) {
    return this.adminService.deleteStoreFee(id);
  }

  @Get('store-fee')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'get list store fee' })
  getListStoreFee(@Query() filter: StoreFeePageOptionDto) {
    return this.adminService.getListStoreFee(filter);
  }

  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'send email in admin' })
  sendEmail(@Body() data: SendEmailDto) {
    return this.adminService.sendEmail(data);
  }

  @Post('store-config')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'upsert store config' })
  @ApiFile({ name: 'logo-upload' }, { storage: storage(storagePath.logo) })
  updateStoreConfig(
    @Body() data: UpsertStoreConfigDto,
    @UploadedFile() file?: IFile,
  ) {
    return this.adminService.upsertStoreConfig(data, file);
  }

  @Get('store-config')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get store config' })
  getStoreConfig() {
    return this.adminService.getStoreConfig();
  }

  @Get('put-on-sale')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'get store config' })
  getListUserPutOnSale(@Query() filter: PutOnSalePageOptionDto) {
    return this.adminService.getListUserPutOnSale(filter);
  }

  @Get('pending-purchase')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'get list pending purchase' })
  getListPendingPurchase(@Query() filter: PendingPurchasePageOptionDto) {
    return this.adminService.getListPendingPurchase(filter);
  }

  @Get('detail-pending-purchase/:id')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'get detail pending purchase' })
  getDetailPendingPurchase(@Param('id') id: Uuid) {
    return this.adminService.getDetailPendingPurchase(id);
  }

  @Put('confirm-pending-purchase/:id')
  @HttpCode(HttpStatus.OK)
  @Admin([AdminRole.SubAdmin])
  @ApiOperation({ summary: 'admin confirm pending purchase' })
  confirmPendingPurchase(@Param('id') id: Uuid) {
    return this.adminService.confirmPendingPurchase(id);
  }

  // @Post('banner')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'upload banner' })
  // @Admin([AdminRole.SubAdmin])
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   FilesInterceptor('listBanner', 10, storage(storagePath.banner)),
  // )
  // uploadBanner(@UploadedFiles() listBanner: IFile[]) {
  //   return this.adminService.uploadBanner(listBanner);
  // }

  @Get('banner')
  @HttpCode(HttpStatus.OK)
  getListBanner(@Query() filter: BannerPageOptionDto) {
    return this.adminService.getListBanner(filter);
  }

  @Post('referral-program-config')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'upsert referral program config' })
  @Admin([AdminRole.SubAdmin])
  upsertReferralProgramConfig(@Body() data: UpsertReferralProgramConfigDto) {
    return this.adminService.upsertReferralProgramConfig(data);
  }

  @Get('referral-program-config')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get store referral program config' })
  @Admin([AdminRole.SubAdmin])
  getListReferralProgramConfig() {
    return this.adminService.getListReferralProgramConfig();
  }

  @Get('service-fee-transaction')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get list service fee transaction of store' })
  @Admin([AdminRole.SubAdmin])
  getListServiceFeeTransaction(
    @Query() filter: ServiceFeeTransactionPageOptionDto,
  ) {
    return this.adminService.getListServiceFeeTransaction(filter);
  }
}
