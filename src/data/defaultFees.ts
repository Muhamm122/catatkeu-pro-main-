import type { IBKRFeeConfig } from "@/types/fees";

export const defaultFees: IBKRFeeConfig = {
  stocks: {
    model: "fixed",
    fixed: {
      perShare: 0.005,
      minPerOrder: 1.0,
      maxPercentOfTrade: 1.0,
    },
    tiered: {
      perShare: 0.0035,
      minPerOrder: 0.35,
      maxPerOrder: 0.5,
    },
  },
  options: {
    model: "fixed",
    fixed: {
      perContract: 0.65,
      minPerOrder: 1.0,
    },
    tiered: {
      perContract: 0.25,
      minPerOrder: 0.25,
      exchangeFee: 0.3,
      clearingFee: 0.02,
      regulatoryFee: 0.0388,
    },
  },
  futures: {
    perContract: 0.85,
    exchangeFee: 1.28,
    nfaFee: 0.02,
  },
  forex: {
    basisPoints: 0.2,
    minPerOrder: 2.0,
    conversionFee: 0.002,
  },
  regulatory: {
    secFeeRate: 0.0000278,
    finraTafRate: 0.000166,
    finraTafMax: 8.3,
  },
  exchange: {
    addLiquidityRebate: -0.002,
    removeLiquidityFee: 0.003,
    routingFee: 0.003,
  },
  currency: {
    conversionBasisPoints: 2.0,
    minFee: 2.0,
  },
  marketData: {
    usSecuritiesSnapshot: 1.0,
    usSecuritiesStreaming: 4.5,
    usOptionsSnapshot: 1.0,
    usOptionsStreaming: 4.5,
    globalDataBundle: 10.0,
  },
  account: {
    monthlyMinActivityFee: 0,
    inactivityFee: 0,
    inactivityThresholdMonths: 0,
    withdrawalFee: 0,
    freeWithdrawalsPerMonth: 1,
  },
  margin: {
    baseRate: 6.83,
    spreadTier1: 1.5,
    spreadTier2: 1.0,
    spreadTier3: 0.5,
    tier1Max: 100000,
    tier2Max: 1000000,
  },
};
