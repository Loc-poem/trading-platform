import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { ResendOtpCodeDto } from './dto/resend-otp-code.dto';
import { ResetPasswordDto } from './dto/reset-password-dto';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { VerifyOtpCodeDto } from './dto/verify-otp-code.dto';
import { VerifyOtpMailDto } from './dto/verify-otp-mail.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(userRegisterDto);

    return createdUser.toDto({
      isActive: true,
    });
  }

  @Post('verify-otp-code')
  @HttpCode(HttpStatus.OK)
  async verifyOtpCode(@Body() data: VerifyOtpCodeDto) {
    const userEntity = await this.userService.verifyOtpCode(data);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: userEntity.role,
    });

    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Post('verify-otp-code-reset')
  @HttpCode(HttpStatus.OK)
  verifyOtpCodeReset(@Body() data: VerifyOtpCodeDto) {
    return this.userService.verifyOtpCodeReset(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: UserLoginDto,
  ): Promise<LoginPayloadDto | UserEntity> {
    const user = await this.authService.loginUser(data);

    if (!user.isVerified) {
      return {
        id: user.id,
        isVerified: user.isVerified,
        phone: user.phone,
        phoneCode: user.phoneCode,
      } as UserEntity;
    }

    const token = await this.authService.createAccessToken({
      userId: user.id,
      role: user.role,
    });

    return new LoginPayloadDto(user, token);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.userService.forgotPassword(data);
  }

  @Put('resend-otp-code')
  @HttpCode(HttpStatus.OK)
  resendOtpCode(@Body() data: ResendOtpCodeDto) {
    return this.userService.resentOtpCode(data);
  }

  @Put('resend-otp-code-reset')
  @HttpCode(HttpStatus.OK)
  resendOtpCodeReset(@Body() data: ResendOtpCodeDto) {
    return this.userService.resentOtpCodeReset(data);
  }

  @Put('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.userService.resetPassword(data);
  }

  @Post('verify-phone-number')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiOperation({ summary: 'Create and send otp to verify phone number' })
  sendOtpVerifyPhoneNumber(@AuthUser() user: UserEntity) {
    return this.userService.sendOtpVerifyPhoneNumber(user);
  }

  @Post('resend-otp-verify-mail')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiOperation({ summary: 're send otp to verify email' })
  resendOtpVerifyMail(@AuthUser() user: UserEntity) {
    return this.userService.sendOtpVerifyPhoneNumber(user);
  }

  @Post('verify-otp-verify-mail')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiOperation({ summary: 'verify otp for verify email' })
  verifyOtpMail(@AuthUser() user: UserEntity, @Body() data: VerifyOtpMailDto) {
    return this.userService.verifyOtpPhoneNumber(user, data);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity) {
    return this.userService.getUserProfile(user);
  }
}
