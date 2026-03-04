import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useExchangeRates } from "../hooks/useExchangeRates";
import { ALL_CURRENCIES, CURRENCY_MAP } from "../lib/currencies";

type SortKey = "name" | "code" | "rate";
type SortDir = "asc" | "desc";

const TOP_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CNY",
  "CAD",
  "AUD",
  "CHF",
  "INR",
  "MXN",
  "BRL",
  "KRW",
  "SGD",
  "NOK",
  "SEK",
  "DKK",
  "NZD",
  "ZAR",
  "SAR",
  "AED",
  "TRY",
  "PLN",
  "CZK",
  "IDR",
  "ILS",
  "EGP",
  "NGN",
  "GHS",
  "COP",
  "PEN",
];

export default function CurrencyTable() {
  const { rates, isLoading } = useExchangeRates();
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showAll, setShowAll] = useState(false);

  // Build currency rows from rates
  const currencyRows = useMemo(() => {
    if (Object.keys(rates).length === 0) return [];
    return ALL_CURRENCIES.filter((c) => rates[c.code] !== undefined).map(
      (c) => ({
        ...c,
        rate: rates[c.code],
      }),
    );
  }, [rates]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedRows = useMemo(() => {
    const list = [...currencyRows];
    list.sort((a, b) => {
      if (sortKey === "rate") {
        return sortDir === "asc" ? a.rate - b.rate : b.rate - a.rate;
      }
      const aVal = (sortKey === "name" ? a.name : a.code).toLowerCase();
      const bVal = (sortKey === "name" ? b.name : b.code).toLowerCase();
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
    return list;
  }, [currencyRows, sortKey, sortDir]);

  const displayRows = useMemo(() => {
    if (showAll) return sortedRows;
    if (sortKey === "code" && sortDir === "asc") {
      const top = TOP_CURRENCIES.map((code) =>
        currencyRows.find((c) => c.code === code),
      ).filter(Boolean) as typeof currencyRows;
      const rest = currencyRows.filter((c) => !TOP_CURRENCIES.includes(c.code));
      return [...top, ...rest].slice(0, 30);
    }
    return sortedRows.slice(0, 30);
  }, [showAll, sortedRows, sortKey, sortDir, currencyRows]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <ChevronsUpDown className="w-4 h-4 opacity-40" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-4 h-4 text-usa-gold" />
    ) : (
      <ChevronDown className="w-4 h-4 text-usa-gold" />
    );
  };

  const ThButton = ({ col, label }: { col: SortKey; label: string }) => (
    <button
      type="button"
      onClick={() => handleSort(col)}
      className="flex items-center gap-1 font-bold text-white hover:text-usa-gold transition-colors uppercase tracking-wider text-xs min-h-[44px] w-full"
    >
      {label}
      <SortIcon col={col} />
    </button>
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden animate-pulse">
        <div className="bg-usa-navy px-6 py-4 h-16" />
        <div className="p-4 space-y-2">
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
            <div key={k} className="h-12 bg-usa-navy/10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const usdInfo = CURRENCY_MAP.USD;

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden">
      <div className="bg-usa-navy px-6 py-4">
        <h2 className="font-display font-bold text-xl text-white">
          Exchange Rate Reference Table
        </h2>
        <p className="text-white/55 text-sm mt-1">
          Showing {displayRows.length} of {currencyRows.length} currencies ·
          Live rates vs {usdInfo?.flag} 1 USD
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-usa-navy/90">
              <th className="px-4 py-2 text-left w-12">
                <span className="text-white/50 text-xs uppercase tracking-wider font-bold">
                  Flag
                </span>
              </th>
              <th className="px-4 py-2 text-left">
                <ThButton col="name" label="Currency Name" />
              </th>
              <th className="px-4 py-2 text-left">
                <ThButton col="code" label="Code" />
              </th>
              <th className="px-4 py-2 text-left">
                <span className="text-white/50 text-xs uppercase tracking-wider font-bold">
                  Symbol
                </span>
              </th>
              <th className="px-4 py-2 text-right">
                <ThButton col="rate" label="Rate (per 1 USD)" />
              </th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((currency, idx) => (
              <tr
                key={currency.code}
                className={`border-b border-usa-navy/10 hover:bg-usa-red/5 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-usa-navy/3"
                }`}
              >
                <td className="px-4 py-3 text-xl">{currency.flag}</td>
                <td className="px-4 py-3 font-semibold text-usa-navy">
                  {currency.name}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block bg-usa-navy text-white text-xs font-bold px-2 py-1 rounded">
                    {currency.code}
                  </span>
                </td>
                <td className="px-4 py-3 text-usa-navy/60 font-mono">
                  {currency.symbol}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-usa-navy">
                  {currency.rate >= 1
                    ? currency.rate.toLocaleString(undefined, {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4,
                      })
                    : currency.rate.toFixed(6)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {currencyRows.length > 30 && (
        <div className="px-6 py-4 border-t border-usa-navy/10 text-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2.5 min-h-[44px] bg-usa-navy text-white font-bold rounded-lg hover:bg-usa-red transition-colors text-sm uppercase tracking-wider"
          >
            {showAll
              ? "Show Top 30"
              : `Show All ${currencyRows.length} Currencies`}
          </button>
        </div>
      )}
    </div>
  );
}
