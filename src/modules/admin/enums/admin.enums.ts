export enum AdminRole {
  SuperAdmin = 'super-admin',
  SubAdmin = 'sub-admin',
}

export enum ProfitType {
  ServiceFee = 'service-fee',
}

export enum ServiceFeeTransactionStatus {
  DRAFT = 1,
  SUCCESS = 2,
  FAIL = 3,
  IS_WITHDRAW = 4,
}
