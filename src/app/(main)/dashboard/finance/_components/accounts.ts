import {
  type SimpleIcon as SimpleIconType,
  siBarclays,
  siBinance,
  siBitcoin,
  siEthereum,
  siHsbc,
  siRevolut,
} from "simple-icons";

export type AccountType = "bank" | "savings" | "investment" | "crypto" | "reserve";

export type Account = {
  id: string;
  name: string;
  detail: string;
  type: AccountType;
  balance: number;
  monthlyDelta: number;
  trend: number[];
  icon: SimpleIconType;
  currency?: string;
  cryptoBalance?: string;
  custodian?: string;
};

export const accounts: Account[] = [
  {
    id: "revolut-premium",
    name: "Revolut Premium",
    detail: "**** 4182",
    type: "bank",
    balance: 12450.6,
    monthlyDelta: 240,
    trend: [12100, 12180, 12340, 12260, 12380, 12410, 12450],
    icon: siRevolut,
  },
  {
    id: "hsbc-checking",
    name: "HSBC Bank",
    detail: "**** 1004",
    type: "bank",
    balance: 3200.11,
    monthlyDelta: -180,
    trend: [3380, 3360, 3290, 3340, 3260, 3220, 3200],
    icon: siHsbc,
  },
  {
    id: "barclays-checking",
    name: "Barclays Bank",
    detail: "**** 9912",
    type: "bank",
    balance: 1450,
    monthlyDelta: 45,
    trend: [1405, 1390, 1418, 1432, 1440, 1448, 1450],
    icon: siBarclays,
  },
  {
    id: "revolut-savings",
    name: "Revolut Savings",
    detail: "High-yield · 4.50% APY",
    type: "savings",
    balance: 28400,
    monthlyDelta: 1200,
    trend: [27200, 27500, 27780, 27950, 28100, 28280, 28400],
    icon: siRevolut,
  },
  {
    id: "barclays-isa",
    name: "Barclays ISA",
    detail: "Tax-free savings",
    type: "savings",
    balance: 19920,
    monthlyDelta: 320,
    trend: [19600, 19680, 19740, 19790, 19840, 19890, 19920],
    icon: siBarclays,
  },
  {
    id: "investment-brokerage",
    name: "Brokerage Account",
    detail: "Index portfolio · 78% equities",
    type: "investment",
    balance: 36780,
    monthlyDelta: 2140,
    trend: [34640, 34960, 35420, 35880, 36120, 36510, 36780],
    icon: siHsbc,
  },
  {
    id: "binance-btc",
    name: "Bitcoin",
    detail: "Binance",
    type: "crypto",
    balance: 24150,
    monthlyDelta: 1820,
    trend: [22330, 22980, 23410, 23090, 23740, 24010, 24150],
    icon: siBitcoin,
    cryptoBalance: "0.42 BTC",
    custodian: siBinance.title,
  },
  {
    id: "metamask-eth",
    name: "Ethereum",
    detail: "MetaMask",
    type: "crypto",
    balance: 12420.1,
    monthlyDelta: -310,
    trend: [12730, 12680, 12550, 12490, 12410, 12380, 12420],
    icon: siEthereum,
    cryptoBalance: "4.85 ETH",
    custodian: "MetaMask",
  },
  {
    id: "ledger-vault",
    name: "Cold Storage Vault",
    detail: "Ledger Nano X · Air-gapped",
    type: "reserve",
    balance: 27256,
    monthlyDelta: 0,
    trend: [27256, 27256, 27256, 27256, 27256, 27256, 27256],
    icon: siBitcoin,
    cryptoBalance: "0.48 BTC",
  },
];

export const accountTypeLabels: Record<AccountType, string> = {
  bank: "Bank",
  savings: "Savings",
  investment: "Investment",
  crypto: "Crypto",
  reserve: "Reserve",
};

export const accountTypeOrder: AccountType[] = ["bank", "savings", "investment", "crypto", "reserve"];

export const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

export const totalMonthlyDelta = accounts.reduce((sum, account) => sum + account.monthlyDelta, 0);

export function getAccountById(id: string) {
  return accounts.find((account) => account.id === id);
}

export function getAccountsByType(type: AccountType) {
  return accounts.filter((account) => account.type === type);
}

export function getAllocationByType() {
  return accountTypeOrder
    .map((type) => {
      const subtotal = getAccountsByType(type).reduce((sum, account) => sum + account.balance, 0);
      return {
        type,
        label: accountTypeLabels[type],
        amount: subtotal,
        percentage: totalBalance === 0 ? 0 : subtotal / totalBalance,
      };
    })
    .filter((slice) => slice.amount > 0);
}
