import { useEffect, useState } from "react";

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  lastUpdated: Date | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  cryptoChange24h: Record<string, number>;
  isCached: boolean;
  cacheTime: Date | null;
}

// Full fallback rates relative to USD
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.9201,
  GBP: 0.7895,
  JPY: 149.82,
  CAD: 1.3621,
  AUD: 1.5307,
  CHF: 0.8845,
  CNY: 7.2418,
  HKD: 7.8201,
  NZD: 1.6512,
  SEK: 10.4182,
  KRW: 1329.45,
  SGD: 1.3412,
  NOK: 10.5673,
  MXN: 17.1234,
  INR: 83.1567,
  BRL: 4.9712,
  ZAR: 18.6324,
  RUB: 91.2345,
  TRY: 30.4521,
  AED: 3.6725,
  AFN: 71.2345,
  ALL: 101.234,
  AMD: 400.123,
  ANG: 1.7932,
  AOA: 830.123,
  ARS: 826.456,
  AWG: 1.79,
  AZN: 1.7002,
  BAM: 1.7987,
  BBD: 2.0,
  BDT: 110.234,
  BGN: 1.7987,
  BHD: 0.3761,
  BMD: 1.0,
  BND: 1.3412,
  BOB: 6.9102,
  BSD: 1.0,
  BTN: 83.1567,
  BWP: 13.5678,
  BYN: 3.2145,
  BZD: 2.0175,
  CDF: 2789.12,
  CLP: 942.345,
  COP: 3945.67,
  CRC: 516.789,
  CUP: 24.0,
  CVE: 101.456,
  CZK: 22.4567,
  DJF: 177.721,
  DKK: 6.8901,
  DOP: 58.9012,
  DZD: 134.567,
  EGP: 30.9012,
  ERN: 15.0,
  ETB: 56.789,
  FJD: 2.2456,
  FKP: 0.7895,
  GEL: 2.6789,
  GHS: 12.3456,
  GIP: 0.7895,
  GMD: 67.8901,
  GTQ: 7.8012,
  GYD: 209.012,
  HNL: 24.6789,
  HRK: 7.1234,
  HTG: 132.456,
  HUF: 356.789,
  IDR: 15678.9,
  ILS: 3.6789,
  IQD: 1309.12,
  IRR: 42105.0,
  ISK: 137.456,
  JMD: 155.678,
  JOD: 0.7089,
  KES: 129.456,
  KGS: 89.1234,
  KHR: 4085.67,
  KMF: 452.345,
  KPW: 900.0,
  KWD: 0.30783,
  KYD: 0.833,
  KZT: 447.678,
  LAK: 20967.3,
  LBP: 89500.0,
  LKR: 313.456,
  LRD: 189.012,
  LSL: 18.6324,
  LYD: 4.8123,
  MAD: 10.1234,
  MDL: 17.8901,
  MGA: 4567.89,
  MKD: 56.7891,
  MMK: 2099.12,
  MNT: 3412.34,
  MOP: 8.0678,
  MRU: 39.5678,
  MUR: 44.5678,
  MVR: 15.4235,
  MWK: 1678.9,
  MYR: 4.6789,
  MZN: 63.9012,
  NAD: 18.6324,
  NGN: 1567.89,
  NIO: 36.789,
  NPR: 132.901,
  OMR: 0.38497,
  PAB: 1.0,
  PEN: 3.7891,
  PGK: 3.7845,
  PHP: 56.3456,
  PKR: 278.901,
  PLN: 4.0123,
  PYG: 7345.67,
  QAR: 3.64,
  RON: 4.5678,
  RSD: 107.901,
  RWF: 1289.01,
  SAR: 3.75,
  SBD: 8.4523,
  SCR: 13.1234,
  SDG: 601.234,
  SLL: 22345.6,
  SOS: 571.234,
  SRD: 36.7801,
  STN: 22.5678,
  SVC: 8.75,
  SYP: 12900.0,
  SZL: 18.6324,
  THB: 35.3456,
  TJS: 10.9012,
  TMT: 3.4978,
  TND: 3.1234,
  TOP: 2.3678,
  TTD: 6.7891,
  TWD: 31.6789,
  TZS: 2567.89,
  UAH: 38.1234,
  UGX: 3789.01,
  UYU: 39.1234,
  UZS: 12345.6,
  VES: 36.4512,
  VND: 24567.8,
  VUV: 118.901,
  WST: 2.7123,
  XAF: 612.345,
  XCD: 2.7024,
  XOF: 612.345,
  XPF: 111.345,
  YER: 250.301,
  ZMW: 26.789,
  ZWL: 361.234,
  // Crypto fallback rates (as units per 1 USD, i.e. 1/priceInUSD)
  BTC: 1 / 43000,
  ETH: 1 / 2200,
  BNB: 1 / 310,
  SOL: 1 / 95,
  XRP: 1 / 0.55,
  ADA: 1 / 0.45,
  DOGE: 1 / 0.08,
  USDT: 1 / 1,
  USDC: 1 / 1,
  LTC: 1 / 75,
};

const CACHE_KEY = "ccp_rates_cache";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CachedRates {
  rates: Record<string, number>;
  cryptoChange24h: Record<string, number>;
  timestamp: number;
}

function loadCache(): CachedRates | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedRates;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCache(
  rates: Record<string, number>,
  cryptoChange24h: Record<string, number>,
) {
  try {
    const data: CachedRates = { rates, cryptoChange24h, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

const COINGECKO_ID_MAP: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  binancecoin: "BNB",
  solana: "SOL",
  ripple: "XRP",
  cardano: "ADA",
  dogecoin: "DOGE",
  tether: "USDT",
  "usd-coin": "USDC",
  litecoin: "LTC",
};

export function useExchangeRates(): ExchangeRates {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cryptoChange24h, setCryptoChange24h] = useState<
    Record<string, number>
  >({});
  const [isCached, setIsCached] = useState(false);
  const [cacheTime, setCacheTime] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Seed from cache immediately while fetching
    const cached = loadCache();
    if (cached) {
      setRates(cached.rates);
      setCryptoChange24h(cached.cryptoChange24h ?? {});
      setCacheTime(new Date(cached.timestamp));
      setIsCached(true);
      setLastUpdated(new Date(cached.timestamp));
      setIsLoading(false);
    }

    async function fetchRates() {
      if (!cached) setIsLoading(true);
      setIsError(false);

      try {
        // Fetch fiat and crypto in parallel
        const [fiatResp, cryptoResp] = await Promise.allSettled([
          fetch("https://open.er-api.com/v6/latest/USD"),
          fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple,cardano,dogecoin,tether,usd-coin,litecoin&vs_currencies=usd&include_24hr_change=true",
          ),
        ]);

        if (cancelled) return;

        let fiatRates: Record<string, number> = { ...FALLBACK_RATES };
        let cryptoRates: Record<string, number> = {};
        const change24h: Record<string, number> = {};

        // Process fiat
        if (fiatResp.status === "fulfilled" && fiatResp.value.ok) {
          const fiatData = await fiatResp.value.json();
          fiatRates = { ...(fiatData.rates || FALLBACK_RATES) };
        }

        // Process crypto
        if (cryptoResp.status === "fulfilled" && cryptoResp.value.ok) {
          const cryptoData = await cryptoResp.value.json();
          for (const [geckoId, code] of Object.entries(COINGECKO_ID_MAP)) {
            const entry = cryptoData[geckoId];
            if (entry?.usd) {
              // Rate stored as: how many of this crypto per 1 USD
              cryptoRates[code] = 1 / entry.usd;
            }
            if (entry?.usd_24h_change !== undefined) {
              change24h[code] = entry.usd_24h_change;
            }
          }
        } else {
          // Fallback crypto rates
          for (const code of Object.keys(COINGECKO_ID_MAP).map(
            (k) => COINGECKO_ID_MAP[k],
          )) {
            if (FALLBACK_RATES[code]) cryptoRates[code] = FALLBACK_RATES[code];
          }
        }

        if (cancelled) return;

        const combined = { ...fiatRates, ...cryptoRates };
        setRates(combined);
        setCryptoChange24h(change24h);
        setLastUpdated(new Date());
        setIsCached(false);
        setCacheTime(null);
        setIsLoading(false);
        saveCache(combined, change24h);
      } catch (err) {
        if (cancelled) return;
        console.warn("Rate fetch failed, using fallback/cached rates:", err);
        if (!cached) {
          setRates(FALLBACK_RATES);
          setLastUpdated(new Date());
        }
        setIsError(true);
        setErrorMessage("Live rates unavailable — showing approximate rates");
        setIsLoading(false);
      }
    }

    fetchRates();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    base: "USD",
    rates,
    lastUpdated,
    isLoading,
    isError,
    errorMessage,
    cryptoChange24h,
    isCached,
    cacheTime,
  };
}

export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, number>,
): number | null {
  const fromRate = rates[fromCode];
  const toRate = rates[toCode];
  if (!fromRate || !toRate) return null;
  return amount * (toRate / fromRate);
}

export { FALLBACK_RATES };
