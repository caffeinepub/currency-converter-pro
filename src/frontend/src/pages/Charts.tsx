import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { convertCurrency, useExchangeRates } from "../hooks/useExchangeRates";
import { ALL_CURRENCIES, CURRENCY_MAP } from "../lib/currencies";

type Period = "1D" | "1W" | "1M" | "1Y";

// Seeded pseudo-random for stable charts per currency pair
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateHistory(
  currentRate: number,
  period: Period,
  pairSeed: number,
): { label: string; rate: number }[] {
  const rand = seededRandom(pairSeed);
  const volatility =
    period === "1D"
      ? 0.002
      : period === "1W"
        ? 0.008
        : period === "1M"
          ? 0.03
          : 0.12;

  const counts = { "1D": 24, "1W": 7, "1M": 30, "1Y": 52 };
  const n = counts[period];

  // Start from a slightly different rate n periods ago
  const startOffset = (rand() - 0.5) * volatility * 4;
  let rate = currentRate * (1 + startOffset);

  const now = new Date();
  const data: { label: string; rate: number }[] = [];

  for (let i = n; i >= 0; i--) {
    const date = new Date(now);
    let label = "";
    if (period === "1D") {
      date.setHours(now.getHours() - i);
      label = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (period === "1W") {
      date.setDate(now.getDate() - i);
      label = date.toLocaleDateString([], { weekday: "short" });
    } else if (period === "1M") {
      date.setDate(now.getDate() - i);
      label = date.toLocaleDateString([], { month: "short", day: "numeric" });
    } else {
      date.setDate(now.getDate() - i * 7);
      label = date.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    data.push({ label, rate: Number(rate.toFixed(6)) });

    // Walk forward with random noise
    const change = (rand() - 0.49) * volatility;
    rate = Math.max(rate * (1 + change), 0.000001);
  }

  return data;
}

function getPeriodStats(data: { label: string; rate: number }[]) {
  const rates = data.map((d) => d.rate);
  const high = Math.max(...rates);
  const low = Math.min(...rates);
  const first = rates[0];
  const last = rates[rates.length - 1];
  const change = ((last - first) / first) * 100;
  return { high, low, change };
}

function pairToSeed(from: string, to: string): number {
  const str = `${from}${to}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload?.length) {
    return (
      <div className="bg-usa-navy text-white rounded-lg px-3 py-2 shadow-xl text-sm">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        <p className="font-bold">{Number(payload[0].value).toFixed(6)}</p>
      </div>
    );
  }
  return null;
}

export default function Charts() {
  const { rates, isLoading } = useExchangeRates();
  const [fromCode, setFromCode] = useState("USD");
  const [toCode, setToCode] = useState("EUR");
  const [period, setPeriod] = useState<Period>("1M");

  const currentRate =
    !isLoading && rates[fromCode] && rates[toCode]
      ? (convertCurrency(1, fromCode, toCode, rates) ?? 1)
      : 1;

  const seed = pairToSeed(fromCode, toCode);
  const chartData = generateHistory(currentRate, period, seed);
  const { high, low, change } = getPeriodStats(chartData);
  const isPositive = change >= 0;

  const availableCodes = ALL_CURRENCIES.map((c) => c.code);

  return (
    <div className="min-h-screen bg-usa-bg">
      {/* Header */}
      <header className="bg-usa-navy">
        <div className="h-3 bg-usa-red" />
        <div className="h-1 bg-white" />
        <div className="h-3 bg-usa-red" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
              Historical Rate Charts
            </h1>
            <p className="text-white/60 mt-1">
              Explore exchange rate trends over time
            </p>
          </motion.div>
        </div>
        <div className="h-3 bg-usa-red" />
        <div className="h-1 bg-white" />
        <div className="h-3 bg-usa-red" />
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Currency selectors */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 p-6"
        >
          <h2 className="font-display font-bold text-usa-navy text-lg mb-4">
            Select Currency Pair
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 space-y-1.5">
              <label
                htmlFor="charts-from"
                className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
              >
                Base Currency
              </label>
              <select
                id="charts-from"
                data-ocid="charts.from_select"
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                className="w-full min-h-[48px] px-4 border-2 border-usa-navy/30 rounded-xl font-bold text-usa-navy bg-white focus:outline-none focus:border-usa-red transition-colors"
              >
                {availableCodes.map((code) => {
                  const info = CURRENCY_MAP[code];
                  return (
                    <option key={code} value={code}>
                      {info?.flag} {code} — {info?.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="hidden sm:flex items-center pb-2">
              <span className="text-2xl font-bold text-usa-navy/30">→</span>
            </div>
            <div className="flex-1 space-y-1.5">
              <label
                htmlFor="charts-to"
                className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
              >
                Quote Currency
              </label>
              <select
                id="charts-to"
                data-ocid="charts.to_select"
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                className="w-full min-h-[48px] px-4 border-2 border-usa-navy/30 rounded-xl font-bold text-usa-navy bg-white focus:outline-none focus:border-usa-red transition-colors"
              >
                {availableCodes.map((code) => {
                  const info = CURRENCY_MAP[code];
                  return (
                    <option key={code} value={code}>
                      {info?.flag} {code} — {info?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            {
              label: "Current Rate",
              value: currentRate.toFixed(6),
              color: "text-usa-navy",
            },
            {
              label: `${period} High`,
              value: high.toFixed(6),
              color: "text-green-600",
            },
            {
              label: `${period} Low`,
              value: low.toFixed(6),
              color: "text-red-600",
            },
            {
              label: `${period} Change`,
              value: `${isPositive ? "+" : ""}${change.toFixed(2)}%`,
              color: isPositive ? "text-green-600" : "text-red-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 border-2 border-usa-navy/15 shadow-sm text-center"
            >
              <p className="text-[11px] font-bold text-usa-navy/50 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className={`font-display font-bold text-lg ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Chart card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden"
        >
          {/* Chart header */}
          <div className="bg-usa-navy px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                {fromCode} / {toCode}
              </h2>
              <p className="text-white/50 text-xs mt-0.5">
                {CURRENCY_MAP[fromCode]?.name} to {CURRENCY_MAP[toCode]?.name}
              </p>
            </div>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <TabsList className="bg-usa-navy-light">
                {(["1D", "1W", "1M", "1Y"] as Period[]).map((p) => (
                  <TabsTrigger
                    key={p}
                    value={p}
                    data-ocid={"charts.period.tab"}
                    className="text-white/60 data-[state=active]:bg-usa-red data-[state=active]:text-white font-bold"
                  >
                    {p}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Chart */}
          <div className="p-6">
            {isLoading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-usa-navy/20 border-t-usa-red animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="rateGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={isPositive ? "#16a34a" : "#dc2626"}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={isPositive ? "#16a34a" : "#dc2626"}
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.26 0.07 260 / 0.08)"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "oklch(0.26 0.07 260 / 0.5)" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "oklch(0.26 0.07 260 / 0.5)" }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                    tickFormatter={(v: number) => v.toFixed(4)}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke={isPositive ? "#16a34a" : "#dc2626"}
                    strokeWidth={2}
                    fill="url(#rateGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: isPositive ? "#16a34a" : "#dc2626",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
            <p className="text-center text-xs text-usa-navy/35 mt-2">
              * Simulated historical data for illustration purposes
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
