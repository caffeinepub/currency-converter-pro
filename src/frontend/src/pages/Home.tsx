import AdSlot from "../components/AdSlot";
import CurrencyConverter from "../components/CurrencyConverter";
import CurrencyTable from "../components/CurrencyTable";

export default function Home() {
  return (
    <div className="min-h-screen bg-usa-bg">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-usa-navy">
        {/* Background texture */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-bg.dim_1440x320.png')",
          }}
        />

        {/* Top stripe */}
        <div className="relative z-10">
          <div className="h-3 bg-usa-red" />
          <div className="h-1.5 bg-white" />
          <div className="h-3 bg-usa-red" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            {/* USA Flag */}
            <div className="flex-shrink-0">
              <img
                src="/assets/generated/usa-flag.dim_400x240.png"
                alt="USA Flag"
                className="w-32 sm:w-44 h-auto rounded-lg shadow-2xl border-2 border-white/30"
              />
            </div>

            {/* Title */}
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <span className="text-usa-gold text-lg tracking-widest select-none">
                  ★ ★ ★
                </span>
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight drop-shadow-lg">
                CURRENCY
                <br />
                <span className="text-usa-gold">CONVERTER</span>
                <span className="text-white"> PRO</span>
              </h1>
              <p className="mt-3 text-white/75 text-base sm:text-lg font-medium max-w-lg">
                Live Exchange Rates • 150+ World Currencies
              </p>
              <p className="mt-1 text-white/55 text-sm">
                Free global currency conversion — simple enough for everyone
              </p>
              <div className="flex items-center gap-2 justify-center sm:justify-start mt-3">
                <span className="text-usa-gold text-lg tracking-widest select-none">
                  ★ ★ ★
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stripes */}
        <div className="relative z-10">
          <div className="h-3 bg-usa-red" />
          <div className="h-1.5 bg-white" />
          <div className="h-3 bg-usa-red" />
        </div>
      </header>

      {/* Leaderboard Ad Slot */}
      <div
        id="ad-slot-top"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center"
      >
        <AdSlot
          width={728}
          height={90}
          slotType="leaderboard"
          className="hidden sm:flex"
        />
        <AdSlot
          width={320}
          height={50}
          slotType="banner"
          className="sm:hidden"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Left: Converter + Table */}
          <div className="space-y-6">
            <CurrencyConverter />
            <CurrencyTable />
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Rectangle Ad Slot (300×250) */}
            <AdSlot width={300} height={250} slotType="rectangle" />

            {/* Quick Tips Card */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden">
              <div className="bg-usa-red px-5 py-3">
                <h3 className="font-display font-bold text-white text-lg">
                  💡 Quick Tips
                </h3>
              </div>
              <div className="p-5 space-y-3 text-sm text-usa-navy">
                <div className="flex gap-2">
                  <span className="text-usa-red font-bold flex-shrink-0">
                    ★
                  </span>
                  <p>
                    Tap a <strong>Quick Select chip</strong> to instantly set
                    your from or to currency
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-usa-red font-bold flex-shrink-0">
                    ★
                  </span>
                  <p>
                    Use the <strong>Number Keypad</strong> for easy
                    touch-friendly input
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-usa-red font-bold flex-shrink-0">
                    ★
                  </span>
                  <p>
                    Click <strong>⇅ Swap</strong> to instantly reverse the
                    conversion
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-usa-red font-bold flex-shrink-0">
                    ★
                  </span>
                  <p>
                    Use <strong>Share / Copy Link</strong> to share your
                    conversion via Google Assistant
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-usa-red font-bold flex-shrink-0">
                    ★
                  </span>
                  <p>Search by currency name or code in the dropdown menus</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-usa-red font-bold flex-shrink-0">
                    ★
                  </span>
                  <p>
                    Use <strong>+/−</strong> buttons to quickly adjust your
                    amount by 1 or 10
                  </p>
                </div>
              </div>
            </div>

            {/* Popular Pairs */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden">
              <div className="bg-usa-navy px-5 py-3">
                <h3 className="font-display font-bold text-white text-lg">
                  🌍 Popular Pairs
                </h3>
              </div>
              <div className="p-4 space-y-1">
                {[
                  {
                    from: "USD",
                    to: "EUR",
                    label: "US Dollar → Euro",
                    flag1: "🇺🇸",
                    flag2: "🇪🇺",
                  },
                  {
                    from: "USD",
                    to: "GBP",
                    label: "US Dollar → British Pound",
                    flag1: "🇺🇸",
                    flag2: "🇬🇧",
                  },
                  {
                    from: "USD",
                    to: "JPY",
                    label: "US Dollar → Japanese Yen",
                    flag1: "🇺🇸",
                    flag2: "🇯🇵",
                  },
                  {
                    from: "USD",
                    to: "CNY",
                    label: "US Dollar → Chinese Yuan",
                    flag1: "🇺🇸",
                    flag2: "🇨🇳",
                  },
                  {
                    from: "USD",
                    to: "INR",
                    label: "US Dollar → Indian Rupee",
                    flag1: "🇺🇸",
                    flag2: "🇮🇳",
                  },
                  {
                    from: "EUR",
                    to: "GBP",
                    label: "Euro → British Pound",
                    flag1: "🇪🇺",
                    flag2: "🇬🇧",
                  },
                  {
                    from: "GBP",
                    to: "USD",
                    label: "British Pound → US Dollar",
                    flag1: "🇬🇧",
                    flag2: "🇺🇸",
                  },
                ].map((pair) => (
                  <a
                    key={`${pair.from}-${pair.to}`}
                    href={`/?from=${pair.from}&to=${pair.to}&amount=100`}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-usa-red/10 transition-colors text-sm font-semibold text-usa-navy min-h-[44px]"
                  >
                    <span className="text-base">{pair.flag1}</span>
                    <span className="text-usa-red">→</span>
                    <span className="text-base">{pair.flag2}</span>
                    <span className="ml-0.5">{pair.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Second sidebar ad */}
            <AdSlot width={300} height={250} slotType="rectangle" />
          </div>
        </div>
      </div>

      {/* Pre-footer Ad Slot */}
      <div
        id="ad-slot-footer"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center"
      >
        <AdSlot
          width={728}
          height={90}
          slotType="leaderboard"
          className="hidden sm:flex"
        />
        <AdSlot
          width={320}
          height={50}
          slotType="banner"
          className="sm:hidden"
        />
      </div>
    </div>
  );
}
