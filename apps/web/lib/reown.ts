import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arcTestnet, sourceChains } from "./chains";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_REOWN_PROJECT_ID is not set — get one at https://dashboard.reown.com"
  );
}

const metadata = {
  name: "UPay",
  description: "The pay button for crypto — any coin, any chain, one tap. Built on Arc Testnet.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  icons: ["https://tryupay.xyz/icon.png"],
};

// Arc as the settlement chain, plus source chains customers may already hold funds
// on — Unified Balance deposits from any of these into the pooled balance that
// spend() then settles to Arc.
export const networks = [arcTestnet, ...sourceChains] as const;

export const wagmiAdapter = new WagmiAdapter({
  networks: [...networks],
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [...networks],
  projectId,
  metadata,
  features: {
    analytics: false,
  },
});
