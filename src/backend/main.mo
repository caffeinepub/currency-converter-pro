import Text "mo:core/Text";
import Float "mo:core/Float";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type Currency = {
    code : Text;
    name : Text;
    symbol : Text;
    rateToUSD : Float;
  };

  module Currency {
    public func compare(currency1 : Currency, currency2 : Currency) : Order.Order {
      Text.compare(currency1.code, currency2.code);
    };
  };

  let currencyMap = Map.fromIter<Text, Currency>(
    [
      // Americas
      ("USD", {
        code = "USD";
        name = "United States Dollar";
        symbol = "$";
        rateToUSD = 1.0;
      }),
      ("CAD", {
        code = "CAD";
        name = "Canadian Dollar";
        symbol = "CA$";
        rateToUSD = 0.75;
      }),
      ("BRL", {
        code = "BRL";
        name = "Brazilian Real";
        symbol = "R$";
        rateToUSD = 0.19;
      }),
      ("ARS", {
        code = "ARS";
        name = "Argentine Peso";
        symbol = "AR$";
        rateToUSD = 0.011;
      }),
      ("CLP", {
        code = "CLP";
        name = "Chilean Peso";
        symbol = "CLP$";
        rateToUSD = 0.0013;
      }),
      ("MXN", {
        code = "MXN";
        name = "Mexican Peso";
        symbol = "Mex$";
        rateToUSD = 0.052;
      }),
      ("COP", {
        code = "COP";
        name = "Colombian Peso";
        symbol = "COL$";
        rateToUSD = 0.00026;
      }),
      ("PEN", {
        code = "PEN";
        name = "Peruvian Sol";
        symbol = "S/";
        rateToUSD = 0.27;
      }),
      // Europe
      ("EUR", {
        code = "EUR";
        name = "Euro";
        symbol = "€";
        rateToUSD = 1.07;
      }),
      ("GBP", {
        code = "GBP";
        name = "British Pound";
        symbol = "£";
        rateToUSD = 1.25;
      }),
      ("CHF", {
        code = "CHF";
        name = "Swiss Franc";
        symbol = "Fr.";
        rateToUSD = 1.1;
      }),
      ("SEK", {
        code = "SEK";
        name = "Swedish Krona";
        symbol = "kr";
        rateToUSD = 0.094;
      }),
      ("NOK", {
        code = "NOK";
        name = "Norwegian Krone";
        symbol = "kr";
        rateToUSD = 0.10;
      }),
      ("DKK", {
        code = "DKK";
        name = "Danish Krone";
        symbol = "kr";
        rateToUSD = 0.14;
      }),
      ("PLN", {
        code = "PLN";
        name = "Polish Zloty";
        symbol = "zł";
        rateToUSD = 0.24;
      }),
      ("CZK", {
        code = "CZK";
        name = "Czech Koruna";
        symbol = "Kč";
        rateToUSD = 0.043;
      }),
      // Asia-Pacific
      ("JPY", {
        code = "JPY";
        name = "Japanese Yen";
        symbol = "¥";
        rateToUSD = 0.0069;
      }),
      ("CNY", {
        code = "CNY";
        name = "Chinese Yuan";
        symbol = "¥";
        rateToUSD = 0.14;
      }),
      ("INR", {
        code = "INR";
        name = "Indian Rupee";
        symbol = "₹";
        rateToUSD = 0.012;
      }),
      ("AUD", {
        code = "AUD";
        name = "Australian Dollar";
        symbol = "A$";
        rateToUSD = 0.66;
      }),
      ("KRW", {
        code = "KRW";
        name = "South Korean Won";
        symbol = "₩";
        rateToUSD = 0.00086;
      }),
      ("NZD", {
        code = "NZD";
        name = "New Zealand Dollar";
        symbol = "NZ$";
        rateToUSD = 0.61;
      }),
      ("SGD", {
        code = "SGD";
        name = "Singapore Dollar";
        symbol = "S$";
        rateToUSD = 0.74;
      }),
      ("IDR", {
        code = "IDR";
        name = "Indonesian Rupiah";
        symbol = "Rp";
        rateToUSD = 0.000065;
      }),
      // Middle East
      ("SAR", {
        code = "SAR";
        name = "Saudi Riyal";
        symbol = "ر.س";
        rateToUSD = 0.27;
      }),
      ("AED", {
        code = "AED";
        name = "UAE Dirham";
        symbol = "د.إ";
        rateToUSD = 0.27;
      }),
      ("TRY", {
        code = "TRY";
        name = "Turkish Lira";
        symbol = "₺";
        rateToUSD = 0.053;
      }),
      ("ILS", {
        code = "ILS";
        name = "Israeli Shekel";
        symbol = "₪";
        rateToUSD = 0.28;
      }),
      ("EGP", {
        code = "EGP";
        name = "Egyptian Pound";
        symbol = "E£";
        rateToUSD = 0.032;
      }),
      // Africa
      ("ZAR", {
        code = "ZAR";
        name = "South African Rand";
        symbol = "R";
        rateToUSD = 0.054;
      }),
      ("NGN", {
        code = "NGN";
        name = "Nigerian Naira";
        symbol = "₦";
        rateToUSD = 0.0013;
      }),
      ("GHS", {
        code = "GHS";
        name = "Ghanaian Cedi";
        symbol = "₵";
        rateToUSD = 0.081;
      }),
      ("KSH", {
        code = "KSH";
        name = "Kenyan Shilling";
        symbol = "KSh";
        rateToUSD = 0.0077;
      }),
      // Caribbean
      ("BSD", {
        code = "BSD";
        name = "Bahamian Dollar";
        symbol = "B$";
        rateToUSD = 1.0;
      }),
      ("BBD", {
        code = "BBD";
        name = "Barbadian Dollar";
        symbol = "Bds$";
        rateToUSD = 0.5;
      }),
      ("XCD", {
        code = "XCD";
        name = "East Caribbean Dollar";
        symbol = "EC$";
        rateToUSD = 0.37;
      }),
      // Add more currencies as needed
    ].values(),
  );

  public query ({ caller }) func getCurrencies() : async [Currency] {
    currencyMap.values().toArray().sort();
  };

  public query ({ caller }) func convert(fromCode : Text, toCode : Text, amount : Float) : async Float {
    let fromCurrency = switch (currencyMap.get(fromCode)) {
      case (null) { Runtime.trap("Unknown currency code: " # fromCode) };
      case (?currency) { currency };
    };

    let toCurrency = switch (currencyMap.get(toCode)) {
      case (null) { Runtime.trap("Unknown currency code: " # toCode) };
      case (?currency) { currency };
    };

    switch (toCurrency.rateToUSD) {
      case (0.0) { Runtime.trap("Conversion rate for " # toCode # " is zero, cannot convert") };
      case (_) {
        let amountInUSD = amount * fromCurrency.rateToUSD;
        amountInUSD / toCurrency.rateToUSD;
      };
    };
  };
};
