import { Order } from '../../constants';
import {
  EnumFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '../../decorators';

export class PageOptionsDto {
  @EnumFieldOptional(() => Order, {
    default: Order.ASC,
  })
  readonly order: Order = Order.ASC;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    int: true,
    nullable: true,
  })
  readonly take?: number;

  get skip(): number {
    return (this.page - 1) * (this.take || 0);
  }

  @StringFieldOptional()
  readonly q?: string;
}
