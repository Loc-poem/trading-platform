import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { ApiError } from '../../common/response/api-error';
import type { UserEntity } from '../user/entities/user.entity';
import type { CreatePaymentDto } from './dto/create-payment.dto';
import type { EditPaymentDto } from './dto/edit-payment.dto';
import type { ListPaymentPageOptionDto } from './dto/list-payment-page-option.dto';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentAccountNumberEntity } from './entities/payment-account-number.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(PaymentAccountNumberEntity)
    private readonly paymentAccountNumberRepository: Repository<PaymentAccountNumberEntity>,
  ) {}

  async createPayment(user: UserEntity, data: CreatePaymentDto) {
    const { listPaymentAccountNumber, type, name, accountName, note } = data;
    const payment = this.paymentRepository.create();
    payment.type = type;
    payment.name = name;
    payment.user = user;
    payment.note = note || '';
    payment.accountName = accountName;

    await this.paymentRepository.save(payment);

    await this.paymentAccountNumberRepository.save(
      listPaymentAccountNumber.map((paymentAccountNumber) =>
        this.paymentAccountNumberRepository.create({
          ...paymentAccountNumber,
          payment,
        }),
      ),
    );

    return payment.toDto();
  }

  async getListPayment(user: UserEntity, filter: ListPaymentPageOptionDto) {
    const { type, take, skip } = filter;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId: user.id,
    };

    if (type) {
      where.type = type;
    }

    const [listPayment, total] = await this.paymentRepository.findAndCount({
      where,
      relations: ['listPaymentAccountNumber'],
      take,
      skip,
      order: {
        createdAt: 'DESC',
      },
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listPayment.toPageDto(pageMetaDto);
  }

  async editPayment(user: UserEntity, data: EditPaymentDto) {
    const { id, listPaymentAccountNumber, ...dataUpdate } = data;
    const existedPayment = await this.paymentRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
      select: ['id'],
    });

    if (!existedPayment) {
      throw new ApiError('Invalid payment id', 'E-1');
    }

    const result = await this.paymentRepository.update(
      {
        id,
        userId: user.id,
      },
      {
        ...dataUpdate,
      },
    );

    if (listPaymentAccountNumber) {
      await this.paymentAccountNumberRepository.delete({
        paymentId: id,
      });

      await this.paymentAccountNumberRepository.save(
        listPaymentAccountNumber.map((paymentAccountNumber) =>
          this.paymentAccountNumberRepository.create({
            ...paymentAccountNumber,
            payment: existedPayment,
          }),
        ),
      );
    }

    return result.affected !== 0;
  }

  async deletePayment(user: UserEntity, id: Uuid) {
    const result = await this.paymentRepository.delete({
      id,
      userId: user.id,
    });

    return result.affected !== 0;
  }
}
