# Currency Converter Pro

## Current State

The app has:
- Home page with a CurrencyConverter component (live rates via open.er-api.com, 150+ fiat currencies, numeric keypad, quick-select chips, swap button, conversion history, share/copy URL)
- CurrencyTable component showing live rates for all currencies
- DeveloperAPI page with placeholder API key, endpoint documentation, and AdSense notes
- Navigation with two routes: "/" and "/developer-api"
- Red/white/blue USA color theme, responsive layout, AdSense-compatible ad slot placeholders
- useExchangeRates hook that fetches from open.er-api.com with a full fallback rates table
- currencies.ts lib with 150+ fiat currencies
- No crypto support, no historical charts, no rate alerts, no financial calculators, no educational content, no multi-output conversion, no natural language converter

## Requested Changes (Diff)

### Add

1. **Cryptocurrency Support**: Add top crypto currencies (BTC, ETH, BNB, SOL, XRP, ADA, DOGE, USDT, USDC, LTC) to the currency list with crypto icons/flags. Fetch crypto rates from CoinGecko public API (https://api.coingecko.com/api/v3/simple/price) alongside fiat rates. Show a "CRYPTO" badge on crypto entries. Add a volatility indicator (24h % change badge) for crypto currencies.

2. **Interactive Historical Exchange Rate Charts**: New "Charts" page (/charts) with an interactive chart component. Show simulated historical rate data for 1D, 1W, 1M, 1Y time frames with toggle buttons. Use recharts (already in the project or install it) to render a line chart. Allow currency pair selection. Show the chart for the selected FROM→TO pair. Note: since we can't fetch real historical data from a free API reliably, generate plausible simulated history based on current rate with realistic variance.

3. **Rate Alerts**: New "Alerts" page (/alerts) where users can set up rate target alerts (e.g. "notify me when USD/EUR hits 0.95"). Stored in localStorage. The app checks current rates on load and shows a toast notification when an alert target is met. Show a list of active alerts with the ability to delete them.

4. **Multi-Output Conversion**: On the Home page, after converting, show the result in 8-10 regional currencies simultaneously (the "Multi-Output" panel). Show the converted value of the input amount in USD, EUR, GBP, JPY, CAD, AUD, CNY, INR, MXN, BRL all at once.

5. **Financial Tools Hub**: New "Tools" page (/tools) with four embedded calculators:
   - Travel Budget Calculator: set destination, daily budget in local currency, number of days → total cost in home currency
   - Tip Calculator: bill amount + tip % → tip amount + total, with common tip presets (15%, 18%, 20%, 25%)
   - Loan Calculator: principal, annual interest rate, term in months → monthly payment and total cost
   - Expense Tracker: add expenses with currency, category, and date; see total in USD; up to 10 expenses stored in localStorage

6. **Educational Content Hub**: New "Learn" page (/learn) with three sections:
   - "What Affects Exchange Rates" – concise explanation of interest rates, inflation, trade balance, speculation
   - "How Banks Mark Up Rates" – mid-market rate vs. bank rate, typical spreads, how to find the best deal
   - "Crypto vs. Fiat" – differences, volatility, stablecoins explained
   - Interactive quiz: 5 multiple-choice questions about currency concepts with instant feedback

7. **Natural Language Converter**: On the Home page, add a "Smart Convert" text field above the main converter that parses natural language input like "100 USD to EUR" or "convert 50 pounds to dollars" and fills in the converter fields automatically. Use regex-based parsing; no external NLP service.

8. **Offline/Cached Conversions**: Cache the last fetched rates in localStorage with a timestamp. On load, use cached rates if the API call fails (in addition to the existing FALLBACK_RATES). Show a "Using cached rates from [time]" notice when serving from cache. Add a PWA manifest (manifest.json) and basic service worker reference in index.html.

9. **Embeddable Widget Page**: On the DeveloperAPI page, add a new "Embeddable Widget" section with a code snippet showing how to embed a minimal iframe-based converter widget on any site. Include a live preview of the widget appearance.

### Modify

- **Navigation**: Add new nav links for "Charts", "Alerts", "Tools", and "Learn" pages. On mobile, these appear in the hamburger menu.
- **Home Page**: Add the "Multi-Output Conversion" panel after the result display. Add the "Smart Convert" natural language input field at the top of the converter card. Add a "Crypto" section in the quick-select chips (separate row for BTC, ETH, SOL, USDT).
- **useExchangeRates.ts**: Extend to also fetch crypto prices from CoinGecko, merge into a unified rates map. Cache rates in localStorage. Add 24h % change data for crypto.
- **currencies.ts**: Add crypto entries (BTC, ETH, BNB, SOL, XRP, ADA, DOGE, USDT, USDC, LTC) with appropriate symbols/flags.

### Remove

- Nothing is removed; all existing features are preserved.

## Implementation Plan

1. Update `currencies.ts` to add 10 crypto currencies with symbols and emoji flags.
2. Update `useExchangeRates.ts` to fetch crypto prices from CoinGecko, merge with fiat rates, cache in localStorage, expose 24h change data.
3. Create `src/frontend/src/pages/Charts.tsx` – interactive historical rate chart page with recharts.
4. Create `src/frontend/src/pages/Alerts.tsx` – rate alert management page with localStorage persistence.
5. Create `src/frontend/src/pages/Tools.tsx` – financial tools hub with 4 calculators.
6. Create `src/frontend/src/pages/Learn.tsx` – educational content hub with quiz.
7. Update `CurrencyConverter.tsx` – add natural language "Smart Convert" field, add multi-output panel after result, add crypto quick-select chips row.
8. Update `Navigation.tsx` – add links for Charts, Alerts, Tools, Learn.
9. Update `App.tsx` – register new routes.
10. Update `DeveloperAPI.tsx` – add embeddable widget section.
11. Update `index.html` – add PWA manifest link and service worker registration.
12. Create `public/manifest.json` for PWA support.
13. Install recharts if not already present.
