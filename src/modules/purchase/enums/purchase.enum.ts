export enum PurchaseStatus {
  DRAFT = 1,
  WAITING_TO_PAYMENT = 2,
  BUYER_CONFIRM_PAY = 3,
  SELLER_CONFIRM_PAY = 4,

  BUYER_NOT_CONFIRM_PAY = 5,
  CANCEL = 6,
  PENDING_BY_DISABLE_USER = 7,
}

export enum PurchaseJob {
  CheckStatus = 'check-status-purchase-job',
}
