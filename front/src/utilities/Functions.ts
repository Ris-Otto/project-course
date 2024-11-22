export function ToCurrencySymbol(currency: string) {
  switch (currency) {
    case "eur":
      return "€";
    default:
      return "€";
  }
}

export function PricingTypeToString(type: number | string) {
  //"0: Cash, 1: Wallet, 2: Card",
  switch (type) {
    case 0:
      return "Cash";
    case 1:
      return "Wallet";
    case 2:
      return "Card";
    case "0":
      return "Cash";
    case "1":
      return "Wallet";
    case "2":
      return "Card";
    default:
      throw new Error("Unknown type " + type);
  }
}
