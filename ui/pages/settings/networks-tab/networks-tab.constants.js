import {
  MAINNET,
  MAINNET_CHAIN_ID,
  ETH_SYMBOL,
} from '../../../../shared/constants/network';

const defaultNetworksData = [
  {
    labelKey: MAINNET,
    iconColor: '#29B6AF',
    providerType: MAINNET,
    rpcUrl: MAINNET_RPC_URL,
    chainId: MAINNET_CHAIN_ID,
    ticker: ETH_SYMBOL,
    blockExplorerUrl: 'https://ubiqscan.io',
  },
];

export { defaultNetworksData };
