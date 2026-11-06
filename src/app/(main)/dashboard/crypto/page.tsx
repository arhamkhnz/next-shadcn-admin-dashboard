import type { Metadata } from "next";

import { CryptoPriceStrip } from "./_components/crypto-price-strip";

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <h1 className="sr-only">Crypto Dashboard</h1>
      <CryptoPriceStrip />
    </div>
  );
}
