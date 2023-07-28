import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { PurchaseEntity } from './purchase.entity';

@Entity({ name: 'proof_transferred_money' })
export class ProofTransferredMoneyEntity extends AbstractEntity {
  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'description' })
  description: string;

  @ManyToOne(
    () => PurchaseEntity,
    (purchase) => purchase.listProofTransferredMoney,
  )
  @JoinColumn({ name: 'purchase_id' })
  purchase: PurchaseEntity;

  @Column({ name: 'purchase_id' })
  purchaseId: Uuid;
}
