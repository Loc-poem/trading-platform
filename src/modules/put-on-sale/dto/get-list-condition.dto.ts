export class GetListConditionDto {
  status: number;

  chainId: number;

  userId: Uuid;

  currencyId: Uuid;

  fiatCurrencyId: Uuid;

  txId;
}
