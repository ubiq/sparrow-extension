import {
  MAINNET,
  MAINNET_CHAIN_ID,
  getRpcUrl,
} from '../../../../shared/constants/network';

const defaultNetworksData = [
  {
    labelKey: MAINNET,
    iconColor: '#29B6AF',
    providerType: MAINNET,
    rpcUrl: getRpcUrl({ network: MAINNET, excludeProjectId: true }),
    chainId: MAINNET_CHAIN_ID,
    ticker: 'UBQ',
    blockExplorerUrl: 'https://ubiqscan.io',
  },
];

export { defaultNetworksData };
