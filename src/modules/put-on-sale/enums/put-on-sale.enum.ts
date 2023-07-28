export enum PutOnSaleStatus {
  DRAFT = 1,
  PENDING = 2,
  ACTIVE = 3,
  FAIL = 4,
  CANCELED = 5,
  CANCEL_PENDING = 6,
  CANCEL_FAIL = 7,
}

export enum PutOnSaleCancelReason {
  UserCancel = 'user-cancel',
  OutOfToken = 'out-of-token',
  UserDisabled = 'user-disabled',
}
