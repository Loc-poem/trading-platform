import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { generateHash } from '../common/utils';
import { AdminEntity } from '../modules/admin/entities/admin.entity';

@EventSubscriber()
export class AdminSubscribers
  implements EntitySubscriberInterface<AdminEntity>
{
  listenTo(): typeof AdminEntity {
    return AdminEntity;
  }

  beforeInsert(event: InsertEvent<AdminEntity>): void {
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }
}
