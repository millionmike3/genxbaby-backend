import { http, createConfig } from "wagmi";
import { polygonAmoy } from "wagmi/chains";

export const config = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http()
  }
});
