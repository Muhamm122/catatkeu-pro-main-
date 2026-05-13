"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import type { IBKRFeeConfig, FeeSection, CommissionModel } from "@/types/fees";
import { defaultFees } from "@/data/defaultFees";
import FeeInput from "./FeeInput";
import SectionCard from "./SectionCard";

const STORAGE_KEY = "ibkr-fee-config";

const TABS: { key: FeeSection; label: string; icon: string }[] = [
  { key: "stocks", label: "Saham", icon: "📈" },
  { key: "options", label: "Opsi", icon: "📊" },
  { key: "futures", label: "Futures", icon: "📉" },
  { key: "forex", label: "Forex", icon: "💱" },
  { key: "regulatory", label: "Regulasi", icon: "🏛️" },
  { key: "exchange", label: "Bursa", icon: "🔄" },
  { key: "currency", label: "Konversi", icon: "💲" },
  { key: "marketData", label: "Data Pasar", icon: "📡" },
  { key: "account", label: "Akun", icon: "👤" },
  { key: "margin", label: "Margin", icon: "🏦" },
];

function loadConfig(): IBKRFeeConfig {
  if (typeof window === "undefined") return defaultFees;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as IBKRFeeConfig;
  } catch {
    // ignore
  }
  return defaultFees;
}

function subscribeToNothing() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );
}

export default function IBKRFeeSettings() {
  const [config, setConfig] = useState<IBKRFeeConfig>(loadConfig);
  const [activeTab, setActiveTab] = useState<FeeSection>("stocks");
  const [saved, setSaved] = useState(false);
  const mounted = useMounted();

  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [config]);

  const handleReset = useCallback(() => {
    setConfig(defaultFees);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ibkr-fee-config.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [config]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(
            ev.target?.result as string
          ) as IBKRFeeConfig;
          setConfig(imported);
        } catch {
          alert("File JSON tidak valid");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  function updateStocks(
    field: string,
    value: number | CommissionModel
  ) {
    setConfig((prev) => {
      const stocks = { ...prev.stocks };
      if (field === "model") {
        stocks.model = value as CommissionModel;
      } else if (field.startsWith("fixed.")) {
        const key = field.replace("fixed.", "") as keyof typeof stocks.fixed;
        stocks.fixed = { ...stocks.fixed, [key]: value as number };
      } else if (field.startsWith("tiered.")) {
        const key = field.replace("tiered.", "") as keyof typeof stocks.tiered;
        stocks.tiered = { ...stocks.tiered, [key]: value as number };
      }
      return { ...prev, stocks };
    });
  }

  function updateOptions(
    field: string,
    value: number | CommissionModel
  ) {
    setConfig((prev) => {
      const options = { ...prev.options };
      if (field === "model") {
        options.model = value as CommissionModel;
      } else if (field.startsWith("fixed.")) {
        const key = field.replace("fixed.", "") as keyof typeof options.fixed;
        options.fixed = { ...options.fixed, [key]: value as number };
      } else if (field.startsWith("tiered.")) {
        const key = field.replace("tiered.", "") as keyof typeof options.tiered;
        options.tiered = { ...options.tiered, [key]: value as number };
      }
      return { ...prev, options };
    });
  }

  function updateNested<K extends keyof IBKRFeeConfig>(
    section: K,
    field: keyof IBKRFeeConfig[K],
    value: number
  ) {
    setConfig((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-zinc-400">Memuat konfigurasi...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-50">
              Pengaturan Biaya IBKR
            </h1>
            <p className="text-sm text-zinc-400">
              Interactive Brokers - Konfigurasi Komisi & Biaya
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              Impor
            </button>
            <button
              onClick={handleExport}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              Ekspor
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-red-800 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-900/30"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {saved ? "Tersimpan!" : "Simpan"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        {/* Sidebar Tabs */}
        <nav className="sticky top-20 hidden h-fit w-48 flex-shrink-0 md:block">
          <ul className="flex flex-col gap-1">
            {TABS.map((tab) => (
              <li key={tab.key}>
                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeTab === tab.key
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Tabs */}
        <div className="fixed bottom-0 left-0 right-0 z-10 overflow-x-auto border-t border-zinc-800 bg-zinc-950 md:hidden">
          <div className="flex gap-1 px-2 py-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  activeTab === tab.key
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-zinc-500"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="min-w-0 flex-1 pb-20 md:pb-0">
          <div className="flex flex-col gap-6">
            {/* Stocks */}
            {activeTab === "stocks" && (
              <SectionCard
                title="Komisi Saham (US)"
                description="Biaya transaksi saham Amerika Serikat"
                icon="📈"
              >
                <div className="col-span-full">
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Model Komisi
                  </label>
                  <div className="flex gap-3">
                    {(["fixed", "tiered"] as const).map((model) => (
                      <button
                        key={model}
                        onClick={() => updateStocks("model", model)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          config.stocks.model === model
                            ? "bg-blue-600 text-white"
                            : "border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                        }`}
                      >
                        {model === "fixed" ? "Fixed" : "Tiered"}
                      </button>
                    ))}
                  </div>
                </div>
                {config.stocks.model === "fixed" ? (
                  <>
                    <FeeInput
                      label="Per Saham"
                      value={config.stocks.fixed.perShare}
                      onChange={(v) => updateStocks("fixed.perShare", v)}
                      suffix="USD/saham"
                      step="0.001"
                      helpText="Biaya per lembar saham"
                    />
                    <FeeInput
                      label="Minimum Per Order"
                      value={config.stocks.fixed.minPerOrder}
                      onChange={(v) => updateStocks("fixed.minPerOrder", v)}
                      suffix="USD"
                      helpText="Biaya minimum per transaksi"
                    />
                    <FeeInput
                      label="Maks % dari Nilai Trade"
                      value={config.stocks.fixed.maxPercentOfTrade}
                      onChange={(v) => updateStocks("fixed.maxPercentOfTrade", v)}
                      suffix="%"
                      helpText="Batas maksimum komisi"
                    />
                  </>
                ) : (
                  <>
                    <FeeInput
                      label="Per Saham"
                      value={config.stocks.tiered.perShare}
                      onChange={(v) => updateStocks("tiered.perShare", v)}
                      suffix="USD/saham"
                      step="0.0001"
                      helpText="Biaya per lembar saham (berjenjang)"
                    />
                    <FeeInput
                      label="Minimum Per Order"
                      value={config.stocks.tiered.minPerOrder}
                      onChange={(v) => updateStocks("tiered.minPerOrder", v)}
                      suffix="USD"
                      helpText="Biaya minimum per transaksi"
                    />
                    <FeeInput
                      label="Maks Per Order"
                      value={config.stocks.tiered.maxPerOrder}
                      onChange={(v) => updateStocks("tiered.maxPerOrder", v)}
                      suffix="% dari nilai trade"
                      helpText="Batas maksimum per transaksi"
                    />
                  </>
                )}
              </SectionCard>
            )}

            {/* Options */}
            {activeTab === "options" && (
              <SectionCard
                title="Komisi Opsi (US)"
                description="Biaya transaksi opsi Amerika Serikat"
                icon="📊"
              >
                <div className="col-span-full">
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Model Komisi
                  </label>
                  <div className="flex gap-3">
                    {(["fixed", "tiered"] as const).map((model) => (
                      <button
                        key={model}
                        onClick={() => updateOptions("model", model)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          config.options.model === model
                            ? "bg-blue-600 text-white"
                            : "border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                        }`}
                      >
                        {model === "fixed" ? "Fixed" : "Tiered"}
                      </button>
                    ))}
                  </div>
                </div>
                {config.options.model === "fixed" ? (
                  <>
                    <FeeInput
                      label="Per Kontrak"
                      value={config.options.fixed.perContract}
                      onChange={(v) => updateOptions("fixed.perContract", v)}
                      suffix="USD/kontrak"
                      helpText="Biaya per kontrak opsi"
                    />
                    <FeeInput
                      label="Minimum Per Order"
                      value={config.options.fixed.minPerOrder}
                      onChange={(v) => updateOptions("fixed.minPerOrder", v)}
                      suffix="USD"
                      helpText="Biaya minimum per transaksi"
                    />
                  </>
                ) : (
                  <>
                    <FeeInput
                      label="Per Kontrak"
                      value={config.options.tiered.perContract}
                      onChange={(v) => updateOptions("tiered.perContract", v)}
                      suffix="USD/kontrak"
                      helpText="Biaya per kontrak (berjenjang)"
                    />
                    <FeeInput
                      label="Minimum Per Order"
                      value={config.options.tiered.minPerOrder}
                      onChange={(v) => updateOptions("tiered.minPerOrder", v)}
                      suffix="USD"
                    />
                    <FeeInput
                      label="Biaya Bursa"
                      value={config.options.tiered.exchangeFee}
                      onChange={(v) => updateOptions("tiered.exchangeFee", v)}
                      suffix="USD/kontrak"
                      helpText="Biaya bursa per kontrak"
                    />
                    <FeeInput
                      label="Biaya Kliring"
                      value={config.options.tiered.clearingFee}
                      onChange={(v) => updateOptions("tiered.clearingFee", v)}
                      suffix="USD/kontrak"
                      helpText="Biaya kliring per kontrak"
                    />
                    <FeeInput
                      label="Biaya Regulasi"
                      value={config.options.tiered.regulatoryFee}
                      onChange={(v) => updateOptions("tiered.regulatoryFee", v)}
                      suffix="USD/kontrak"
                      helpText="ORRF per kontrak"
                    />
                  </>
                )}
              </SectionCard>
            )}

            {/* Futures */}
            {activeTab === "futures" && (
              <SectionCard
                title="Komisi Futures (US)"
                description="Biaya transaksi kontrak berjangka"
                icon="📉"
              >
                <FeeInput
                  label="Per Kontrak"
                  value={config.futures.perContract}
                  onChange={(v) => updateNested("futures", "perContract", v)}
                  suffix="USD/kontrak"
                  helpText="Komisi IBKR per kontrak"
                />
                <FeeInput
                  label="Biaya Bursa"
                  value={config.futures.exchangeFee}
                  onChange={(v) => updateNested("futures", "exchangeFee", v)}
                  suffix="USD/kontrak"
                  helpText="Biaya yang dikenakan bursa"
                />
                <FeeInput
                  label="Biaya NFA"
                  value={config.futures.nfaFee}
                  onChange={(v) => updateNested("futures", "nfaFee", v)}
                  suffix="USD/kontrak"
                  helpText="National Futures Association fee"
                />
              </SectionCard>
            )}

            {/* Forex */}
            {activeTab === "forex" && (
              <SectionCard
                title="Komisi Forex"
                description="Biaya transaksi valuta asing"
                icon="💱"
              >
                <FeeInput
                  label="Basis Points"
                  value={config.forex.basisPoints}
                  onChange={(v) => updateNested("forex", "basisPoints", v)}
                  suffix="bps"
                  step="0.01"
                  helpText="Biaya dalam basis points dari nilai trade"
                />
                <FeeInput
                  label="Minimum Per Order"
                  value={config.forex.minPerOrder}
                  onChange={(v) => updateNested("forex", "minPerOrder", v)}
                  suffix="USD"
                  helpText="Biaya minimum per transaksi forex"
                />
                <FeeInput
                  label="Biaya Konversi"
                  value={config.forex.conversionFee}
                  onChange={(v) => updateNested("forex", "conversionFee", v)}
                  suffix="%"
                  step="0.001"
                  helpText="Biaya konversi mata uang"
                />
              </SectionCard>
            )}

            {/* Regulatory */}
            {activeTab === "regulatory" && (
              <SectionCard
                title="Biaya Regulasi"
                description="Biaya yang dikenakan oleh badan regulasi"
                icon="🏛️"
              >
                <FeeInput
                  label="SEC Fee Rate"
                  value={config.regulatory.secFeeRate}
                  onChange={(v) => updateNested("regulatory", "secFeeRate", v)}
                  suffix="per USD penjualan"
                  step="0.0000001"
                  helpText="Securities and Exchange Commission fee"
                />
                <FeeInput
                  label="FINRA TAF Rate"
                  value={config.regulatory.finraTafRate}
                  onChange={(v) => updateNested("regulatory", "finraTafRate", v)}
                  suffix="per saham"
                  step="0.000001"
                  helpText="FINRA Trading Activity Fee per saham terjual"
                />
                <FeeInput
                  label="FINRA TAF Maks"
                  value={config.regulatory.finraTafMax}
                  onChange={(v) => updateNested("regulatory", "finraTafMax", v)}
                  suffix="USD"
                  helpText="Batas maksimum FINRA TAF per transaksi"
                />
              </SectionCard>
            )}

            {/* Exchange */}
            {activeTab === "exchange" && (
              <SectionCard
                title="Biaya Bursa"
                description="Biaya dan rebate dari bursa saham"
                icon="🔄"
              >
                <FeeInput
                  label="Rebate Likuiditas (Add)"
                  value={config.exchange.addLiquidityRebate}
                  onChange={(v) =>
                    updateNested("exchange", "addLiquidityRebate", v)
                  }
                  suffix="USD/saham"
                  step="0.0001"
                  min={-1}
                  helpText="Rebate untuk menambah likuiditas (nilai negatif = rebate)"
                />
                <FeeInput
                  label="Biaya Likuiditas (Remove)"
                  value={config.exchange.removeLiquidityFee}
                  onChange={(v) =>
                    updateNested("exchange", "removeLiquidityFee", v)
                  }
                  suffix="USD/saham"
                  step="0.0001"
                  helpText="Biaya untuk mengambil likuiditas"
                />
                <FeeInput
                  label="Biaya Routing"
                  value={config.exchange.routingFee}
                  onChange={(v) => updateNested("exchange", "routingFee", v)}
                  suffix="USD/saham"
                  step="0.0001"
                  helpText="Biaya routing order"
                />
              </SectionCard>
            )}

            {/* Currency Conversion */}
            {activeTab === "currency" && (
              <SectionCard
                title="Konversi Mata Uang"
                description="Biaya konversi antar mata uang"
                icon="💲"
              >
                <FeeInput
                  label="Biaya Konversi"
                  value={config.currency.conversionBasisPoints}
                  onChange={(v) =>
                    updateNested("currency", "conversionBasisPoints", v)
                  }
                  suffix="bps"
                  step="0.1"
                  helpText="Biaya dalam basis points"
                />
                <FeeInput
                  label="Biaya Minimum"
                  value={config.currency.minFee}
                  onChange={(v) => updateNested("currency", "minFee", v)}
                  suffix="USD"
                  helpText="Biaya minimum per konversi"
                />
              </SectionCard>
            )}

            {/* Market Data */}
            {activeTab === "marketData" && (
              <SectionCard
                title="Biaya Data Pasar"
                description="Biaya langganan data pasar bulanan"
                icon="📡"
              >
                <FeeInput
                  label="US Securities Snapshot"
                  value={config.marketData.usSecuritiesSnapshot}
                  onChange={(v) =>
                    updateNested("marketData", "usSecuritiesSnapshot", v)
                  }
                  suffix="USD/bulan"
                  helpText="Data snapshot saham AS"
                />
                <FeeInput
                  label="US Securities Streaming"
                  value={config.marketData.usSecuritiesStreaming}
                  onChange={(v) =>
                    updateNested("marketData", "usSecuritiesStreaming", v)
                  }
                  suffix="USD/bulan"
                  helpText="Data streaming realtime saham AS"
                />
                <FeeInput
                  label="US Options Snapshot"
                  value={config.marketData.usOptionsSnapshot}
                  onChange={(v) =>
                    updateNested("marketData", "usOptionsSnapshot", v)
                  }
                  suffix="USD/bulan"
                  helpText="Data snapshot opsi AS"
                />
                <FeeInput
                  label="US Options Streaming"
                  value={config.marketData.usOptionsStreaming}
                  onChange={(v) =>
                    updateNested("marketData", "usOptionsStreaming", v)
                  }
                  suffix="USD/bulan"
                  helpText="Data streaming realtime opsi AS"
                />
                <FeeInput
                  label="Global Data Bundle"
                  value={config.marketData.globalDataBundle}
                  onChange={(v) =>
                    updateNested("marketData", "globalDataBundle", v)
                  }
                  suffix="USD/bulan"
                  helpText="Paket data pasar global"
                />
              </SectionCard>
            )}

            {/* Account */}
            {activeTab === "account" && (
              <SectionCard
                title="Biaya Akun"
                description="Biaya terkait pengelolaan akun"
                icon="👤"
              >
                <FeeInput
                  label="Biaya Aktivitas Minimum"
                  value={config.account.monthlyMinActivityFee}
                  onChange={(v) =>
                    updateNested("account", "monthlyMinActivityFee", v)
                  }
                  suffix="USD/bulan"
                  helpText="Biaya minimum aktivitas bulanan"
                />
                <FeeInput
                  label="Biaya Inaktivitas"
                  value={config.account.inactivityFee}
                  onChange={(v) =>
                    updateNested("account", "inactivityFee", v)
                  }
                  suffix="USD/bulan"
                  helpText="Biaya jika akun tidak aktif"
                />
                <FeeInput
                  label="Ambang Inaktivitas"
                  value={config.account.inactivityThresholdMonths}
                  onChange={(v) =>
                    updateNested("account", "inactivityThresholdMonths", v)
                  }
                  suffix="bulan"
                  step="1"
                  helpText="Jumlah bulan sebelum biaya inaktivitas berlaku"
                />
                <FeeInput
                  label="Biaya Penarikan"
                  value={config.account.withdrawalFee}
                  onChange={(v) =>
                    updateNested("account", "withdrawalFee", v)
                  }
                  suffix="USD"
                  helpText="Biaya per penarikan dana"
                />
                <FeeInput
                  label="Penarikan Gratis/Bulan"
                  value={config.account.freeWithdrawalsPerMonth}
                  onChange={(v) =>
                    updateNested("account", "freeWithdrawalsPerMonth", v)
                  }
                  suffix="kali"
                  step="1"
                  helpText="Jumlah penarikan gratis per bulan"
                />
              </SectionCard>
            )}

            {/* Margin */}
            {activeTab === "margin" && (
              <SectionCard
                title="Suku Bunga Margin"
                description="Suku bunga pinjaman margin"
                icon="🏦"
              >
                <FeeInput
                  label="Suku Bunga Dasar (Benchmark)"
                  value={config.margin.baseRate}
                  onChange={(v) => updateNested("margin", "baseRate", v)}
                  suffix="%"
                  step="0.01"
                  helpText="Fed Funds rate atau benchmark rate"
                />
                <FeeInput
                  label="Spread Tier 1"
                  value={config.margin.spreadTier1}
                  onChange={(v) => updateNested("margin", "spreadTier1", v)}
                  suffix="%"
                  step="0.01"
                  helpText="Spread tambahan untuk pinjaman tier 1"
                />
                <FeeInput
                  label="Spread Tier 2"
                  value={config.margin.spreadTier2}
                  onChange={(v) => updateNested("margin", "spreadTier2", v)}
                  suffix="%"
                  step="0.01"
                  helpText="Spread tambahan untuk pinjaman tier 2"
                />
                <FeeInput
                  label="Spread Tier 3"
                  value={config.margin.spreadTier3}
                  onChange={(v) => updateNested("margin", "spreadTier3", v)}
                  suffix="%"
                  step="0.01"
                  helpText="Spread tambahan untuk pinjaman tier 3"
                />
                <FeeInput
                  label="Batas Tier 1"
                  value={config.margin.tier1Max}
                  onChange={(v) => updateNested("margin", "tier1Max", v)}
                  suffix="USD"
                  step="1000"
                  helpText="Batas atas pinjaman tier 1"
                />
                <FeeInput
                  label="Batas Tier 2"
                  value={config.margin.tier2Max}
                  onChange={(v) => updateNested("margin", "tier2Max", v)}
                  suffix="USD"
                  step="10000"
                  helpText="Batas atas pinjaman tier 2"
                />
              </SectionCard>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
