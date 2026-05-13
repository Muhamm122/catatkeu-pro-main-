export type CommissionModel = "fixed" | "tiered";

export interface StockCommission {
  model: CommissionModel;
  fixed: {
    perShare: number;
    minPerOrder: number;
    maxPercentOfTrade: number;
  };
  tiered: {
    perShare: number;
    minPerOrder: number;
    maxPerOrder: number;
  };
}

export interface OptionsCommission {
  model: CommissionModel;
  fixed: {
    perContract: number;
    minPerOrder: number;
  };
  tiered: {
    perContract: number;
    minPerOrder: number;
    exchangeFee: number;
    clearingFee: number;
    regulatoryFee: number;
  };
}

export interface FuturesCommission {
  perContract: number;
  exchangeFee: number;
  nfaFee: number;
}

export interface ForexCommission {
  basisPoints: number;
  minPerOrder: number;
  conversionFee: number;
}

export interface RegulatoryFees {
  secFeeRate: number;
  finraTafRate: number;
  finraTafMax: number;
}

export interface ExchangeFees {
  addLiquidityRebate: number;
  removeLiquidityFee: number;
  routingFee: number;
}

export interface CurrencyConversion {
  conversionBasisPoints: number;
  minFee: number;
}

export interface MarketDataFees {
  usSecuritiesSnapshot: number;
  usSecuritiesStreaming: number;
  usOptionsSnapshot: number;
  usOptionsStreaming: number;
  globalDataBundle: number;
}

export interface AccountFees {
  monthlyMinActivityFee: number;
  inactivityFee: number;
  inactivityThresholdMonths: number;
  withdrawalFee: number;
  freeWithdrawalsPerMonth: number;
}

export interface MarginRates {
  baseRate: number;
  spreadTier1: number;
  spreadTier2: number;
  spreadTier3: number;
  tier1Max: number;
  tier2Max: number;
}

export interface IBKRFeeConfig {
  stocks: StockCommission;
  options: OptionsCommission;
  futures: FuturesCommission;
  forex: ForexCommission;
  regulatory: RegulatoryFees;
  exchange: ExchangeFees;
  currency: CurrencyConversion;
  marketData: MarketDataFees;
  account: AccountFees;
  margin: MarginRates;
}

export type FeeSection =
  | "stocks"
  | "options"
  | "futures"
  | "forex"
  | "regulatory"
  | "exchange"
  | "currency"
  | "marketData"
  | "account"
  | "margin";
