import { PrivyClient } from '@privy-io/privy-node';

export const privyNode = new PrivyClient(process.env.PRIVY_API_KEY, process.env.PRIVY_API_SECRET);