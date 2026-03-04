import {
  ArrowRight,
  Check,
  Code2,
  Copy,
  DollarSign,
  Globe,
  Key,
} from "lucide-react";

function DollarSignPreview() {
  return <DollarSign className="w-4 h-4 text-usa-gold" />;
}
import { useState } from "react";
import { toast } from "sonner";

const PLACEHOLDER_API_KEY = "7f3a9c12-4e8b-4d2f-a1b5-9e6c3f8d2a47";

export default function DeveloperAPI() {
  const [copied, setCopied] = useState(false);

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(PLACEHOLDER_API_KEY);
      setCopied(true);
      toast.success("API key copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  };

  return (
    <div className="min-h-screen bg-usa-bg">
      {/* Page Header */}
      <header className="bg-usa-navy relative overflow-hidden">
        <div className="h-3 bg-usa-red" />
        <div className="h-1.5 bg-usa-white" />
        <div className="h-3 bg-usa-red" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-usa-gold rounded-xl flex items-center justify-center shadow-lg">
              <Code2 className="w-8 h-8 text-usa-navy" />
            </div>
            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-usa-white">
                Developer API
              </h1>
              <p className="text-usa-white/70 mt-1">
                Integrate Currency Converter Pro into your applications
              </p>
            </div>
          </div>
        </div>
        <div className="h-3 bg-usa-red" />
        <div className="h-1.5 bg-usa-white" />
        <div className="h-3 bg-usa-red" />
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* API Key Section */}
        <section className="bg-usa-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden">
          <div className="bg-usa-navy px-6 py-4 flex items-center gap-3">
            <Key className="w-5 h-5 text-usa-gold" />
            <h2 className="font-display font-bold text-xl text-usa-white">
              Your API Key
            </h2>
          </div>
          <div className="p-6">
            <p className="text-usa-navy/70 text-sm mb-4">
              Use this API key to authenticate your requests. Keep it secure and
              do not share it publicly. This is a placeholder key for
              demonstration purposes.
            </p>
            <div className="flex items-center gap-3 bg-usa-navy/5 border-2 border-usa-navy/20 rounded-xl p-4">
              <code className="flex-1 font-mono text-sm sm:text-base text-usa-navy font-bold break-all">
                {PLACEHOLDER_API_KEY}
              </code>
              <button
                type="button"
                onClick={handleCopyKey}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-usa-red text-usa-white font-bold rounded-lg hover:bg-usa-red/80 transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Key
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-usa-navy/50 mt-3">
              ⚠️ This is a static placeholder API key for display purposes. A
              live authentication system is not yet implemented.
            </p>
          </div>
        </section>

        {/* Endpoints */}
        <section className="bg-usa-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden">
          <div className="bg-usa-navy px-6 py-4 flex items-center gap-3">
            <Globe className="w-5 h-5 text-usa-gold" />
            <h2 className="font-display font-bold text-xl text-usa-white">
              Available Endpoints
            </h2>
          </div>
          <div className="p-6 space-y-8">
            {/* getCurrencies */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-usa-red text-usa-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  QUERY
                </span>
                <h3 className="font-display font-bold text-xl text-usa-navy">
                  getCurrencies()
                </h3>
              </div>
              <p className="text-usa-navy/70">
                Returns the complete list of all supported currencies. Each
                currency includes its ISO 4217 code, full name, symbol, and
                exchange rate relative to 1 USD.
              </p>

              <div className="bg-usa-navy rounded-xl p-4 overflow-x-auto">
                <p className="text-usa-gold text-xs font-bold uppercase tracking-wider mb-2">
                  Example Request
                </p>
                <pre className="text-usa-white/90 text-sm font-mono whitespace-pre-wrap">
                  {`// Using the actor interface
const currencies = await actor.getCurrencies();

// Returns: Array of Currency objects
// [
//   { code: "USD", name: "United States Dollar", symbol: "$", rateToUSD: 1.0 },
//   { code: "EUR", name: "Euro", symbol: "€", rateToUSD: 1.07 },
//   ...
// ]`}
                </pre>
              </div>

              <div className="bg-usa-navy/5 border border-usa-navy/20 rounded-xl p-4">
                <p className="text-xs font-bold text-usa-navy uppercase tracking-wider mb-2">
                  Response Fields
                </p>
                <div className="space-y-2 text-sm">
                  {[
                    {
                      field: "code",
                      type: "string",
                      desc: 'ISO 4217 currency code (e.g. "USD", "EUR")',
                    },
                    {
                      field: "name",
                      type: "string",
                      desc: 'Full currency name (e.g. "United States Dollar")',
                    },
                    {
                      field: "symbol",
                      type: "string",
                      desc: 'Currency symbol (e.g. "$", "€", "£")',
                    },
                    {
                      field: "rateToUSD",
                      type: "number",
                      desc: "Exchange rate: how many USD equals 1 unit of this currency",
                    },
                  ].map((f) => (
                    <div key={f.field} className="flex gap-3">
                      <code className="text-usa-red font-bold w-24 flex-shrink-0">
                        {f.field}
                      </code>
                      <span className="text-usa-navy/50 w-16 flex-shrink-0">
                        {f.type}
                      </span>
                      <span className="text-usa-navy/70">{f.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t-2 border-usa-navy/10" />

            {/* convert */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-usa-navy text-usa-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  QUERY
                </span>
                <h3 className="font-display font-bold text-xl text-usa-navy">
                  convert(fromCode, toCode, amount)
                </h3>
              </div>
              <p className="text-usa-navy/70">
                Converts a given amount from one currency to another. Pass the
                ISO 4217 currency codes for both the source and target
                currencies, along with the numeric amount to convert.
              </p>

              <div className="bg-usa-navy rounded-xl p-4 overflow-x-auto">
                <p className="text-usa-gold text-xs font-bold uppercase tracking-wider mb-2">
                  Example Request
                </p>
                <pre className="text-usa-white/90 text-sm font-mono whitespace-pre-wrap">
                  {`// Convert 100 US Dollars to Euros
const result = await actor.convert("USD", "EUR", 100);

// Returns: number
// 93.46 (approximately 93.46 EUR)

// Convert 50 British Pounds to Japanese Yen
const yenAmount = await actor.convert("GBP", "JPY", 50);
// Returns: 9057.97 (approximately)`}
                </pre>
              </div>

              <div className="bg-usa-navy/5 border border-usa-navy/20 rounded-xl p-4">
                <p className="text-xs font-bold text-usa-navy uppercase tracking-wider mb-2">
                  Parameters
                </p>
                <div className="space-y-2 text-sm">
                  {[
                    {
                      param: "fromCode",
                      type: "string",
                      desc: 'ISO 4217 code of the source currency (e.g. "USD")',
                    },
                    {
                      param: "toCode",
                      type: "string",
                      desc: 'ISO 4217 code of the target currency (e.g. "EUR")',
                    },
                    {
                      param: "amount",
                      type: "number",
                      desc: "The numeric amount to convert (must be greater than 0)",
                    },
                  ].map((p) => (
                    <div key={p.param} className="flex gap-3">
                      <code className="text-usa-red font-bold w-24 flex-shrink-0">
                        {p.param}
                      </code>
                      <span className="text-usa-navy/50 w-16 flex-shrink-0">
                        {p.type}
                      </span>
                      <span className="text-usa-navy/70">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Google Assistant / Shareable URL */}
        <section className="bg-usa-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden">
          <div className="bg-usa-red px-6 py-4 flex items-center gap-3">
            <ArrowRight className="w-5 h-5 text-usa-white" />
            <h2 className="font-display font-bold text-xl text-usa-white">
              Shareable URL Format
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-usa-navy/70">
              Currency Converter Pro supports shareable URLs with query
              parameters. These URLs can be used with Google Assistant,
              bookmarks, or shared directly with others.
            </p>
            <div className="bg-usa-navy rounded-xl p-4 overflow-x-auto">
              <p className="text-usa-gold text-xs font-bold uppercase tracking-wider mb-2">
                URL Format
              </p>
              <pre className="text-usa-white/90 text-sm font-mono whitespace-pre-wrap">
                {`https://your-domain.com/?from=USD&to=EUR&amount=100

Parameters:
  from    — Source currency ISO code (e.g. USD, EUR, GBP)
  to      — Target currency ISO code (e.g. JPY, CNY, INR)
  amount  — Numeric amount to convert (e.g. 100, 250.50)

Example:
  ?from=USD&to=JPY&amount=500
  → Converts 500 US Dollars to Japanese Yen`}
              </pre>
            </div>
            <p className="text-sm text-usa-navy/60">
              When a user visits a URL with these parameters, the converter will
              automatically pre-populate and perform the conversion. This makes
              it easy to share specific conversions via Google Assistant,
              messaging apps, or email.
            </p>
          </div>
        </section>

        {/* Embeddable Widget Section */}
        <section className="bg-usa-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden">
          <div className="bg-usa-red px-6 py-4 flex items-center gap-3">
            <Code2 className="w-5 h-5 text-usa-white" />
            <h2 className="font-display font-bold text-xl text-usa-white">
              Embeddable Widget
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-usa-navy/70">
              Embed Currency Converter Pro directly on your website, WordPress
              blog, or e-commerce store. The widget uses our shareable URL
              format with a special{" "}
              <code className="bg-usa-navy/10 px-1 rounded text-sm">
                widget=1
              </code>{" "}
              parameter to render in a compact form.
            </p>

            <div className="bg-usa-navy rounded-xl p-4 overflow-x-auto">
              <p className="text-usa-gold text-xs font-bold uppercase tracking-wider mb-2">
                iframe Embed Code
              </p>
              <pre className="text-usa-white/90 text-sm font-mono whitespace-pre-wrap">
                {`<iframe
  src="https://your-domain.com/?from=USD&to=EUR&amount=100&widget=1"
  width="400"
  height="300"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.15);"
  title="Currency Converter Pro Widget"
></iframe>`}
              </pre>
            </div>

            <div className="bg-usa-navy rounded-xl p-4 overflow-x-auto">
              <p className="text-usa-gold text-xs font-bold uppercase tracking-wider mb-2">
                WordPress Shortcode (Coming Soon)
              </p>
              <pre className="text-usa-white/90 text-sm font-mono">
                {`[currency_converter_pro from="USD" to="EUR" amount="100"]`}
              </pre>
            </div>

            {/* Live preview */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-usa-navy/60 uppercase tracking-wider">
                Live Preview
              </p>
              <div
                className="border-2 border-usa-navy/20 rounded-xl overflow-hidden"
                style={{ maxWidth: 400 }}
              >
                <div className="bg-usa-navy px-4 py-3 flex items-center gap-2">
                  <DollarSignPreview />
                  <span className="text-white font-bold text-sm">
                    Currency Converter Pro
                  </span>
                  <span className="ml-auto text-white/40 text-xs">widget</span>
                </div>
                <div className="p-4 bg-usa-bg space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border-2 border-usa-navy/20 rounded-lg px-3 py-2 text-sm font-bold text-usa-navy">
                      🇺🇸 USD — United States Dollar
                    </div>
                  </div>
                  <div className="bg-white border-2 border-usa-navy/20 rounded-lg px-4 py-3 text-center text-2xl font-bold text-usa-navy">
                    100
                  </div>
                  <div className="flex justify-center">
                    <span className="bg-usa-red text-white rounded-full px-4 py-1 text-xs font-bold">
                      ⇅ SWAP
                    </span>
                  </div>
                  <div className="flex-1 bg-white border-2 border-usa-navy/20 rounded-lg px-3 py-2 text-sm font-bold text-usa-navy">
                    🇪🇺 EUR — Euro
                  </div>
                  <div className="bg-usa-navy rounded-lg p-3 text-center">
                    <span className="text-white/60 text-xs">Result</span>
                    <p className="text-usa-gold font-bold text-xl">92.01 EUR</p>
                    <p className="text-white/40 text-xs">1 USD = 0.9201 EUR</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {[
                { param: "from", desc: "Source currency code (e.g. USD)" },
                { param: "to", desc: "Target currency code (e.g. EUR)" },
                { param: "amount", desc: "Initial amount to convert" },
              ].map((p) => (
                <div
                  key={p.param}
                  className="bg-usa-navy/5 border border-usa-navy/20 rounded-lg p-3"
                >
                  <code className="text-usa-red font-bold text-sm">
                    {p.param}
                  </code>
                  <p className="text-usa-navy/60 text-xs mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AdSense Note */}
        <section className="bg-usa-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden">
          <div className="bg-usa-navy px-6 py-4">
            <h2 className="font-display font-bold text-xl text-usa-white">
              Google AdSense Integration
            </h2>
          </div>
          <div className="p-6 space-y-3 text-sm text-usa-navy/70">
            <p>
              Currency Converter Pro is built with Google AdSense compatibility
              in mind. Ad slots are pre-configured in the layout at standard
              positions:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-usa-red font-bold">★</span> Leaderboard
                banner (728×90) below the hero header
              </li>
              <li className="flex gap-2">
                <span className="text-usa-red font-bold">★</span> Rectangle
                (300×250) in the sidebar
              </li>
              <li className="flex gap-2">
                <span className="text-usa-red font-bold">★</span> Banner above
                the footer
              </li>
            </ul>
            <p className="mt-3">
              To activate AdSense, add your publisher script to{" "}
              <code className="bg-usa-navy/10 px-1 rounded">index.html</code>{" "}
              and replace the placeholder{" "}
              <code className="bg-usa-navy/10 px-1 rounded">
                data-ad-client
              </code>{" "}
              and{" "}
              <code className="bg-usa-navy/10 px-1 rounded">data-ad-slot</code>{" "}
              values in{" "}
              <code className="bg-usa-navy/10 px-1 rounded">AdSlot.tsx</code>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
