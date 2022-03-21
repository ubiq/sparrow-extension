export const MAINNET = 'mainnet';
export const LOCALHOST = 'localhost';
export const NETWORK_TYPE_RPC = 'rpc';

export const MAINNET_NETWORK_ID = '1';
export const LOCALHOST_NETWORK_ID = '1337';

export const MAINNET_CHAIN_ID = '0x1';
export const LOCALHOST_CHAIN_ID = '0x539';
export const OPTIMISM_CHAIN_ID = '0xa';
export const OPTIMISM_TESTNET_CHAIN_ID = '0x45';

/**
 * The largest possible chain ID we can handle.
 * Explanation: https://gist.github.com/rekmarks/a47bd5f2525936c4b8eee31a16345553
 */
export const MAX_SAFE_CHAIN_ID = 4503599627370476;

export const MAINNET_DISPLAY_NAME = 'Ubiq Mainnet';
export const LOCALHOST_DISPLAY_NAME = 'Localhost 8588';

const infuraProjectId = process.env.INFURA_PROJECT_ID;
export const getRpcUrl = ({ network, excludeProjectId = false }) =>
  `https://${network}.infura.io/v3/${excludeProjectId ? '' : infuraProjectId}`;

export const MAINNET_RPC_URL = getRpcUrl({ network: MAINNET });
export const LOCALHOST_RPC_URL = 'http://localhost:8588';

export const ETH_SYMBOL = 'UBQ';
export const WETH_SYMBOL = 'WUBQ';
export const TEST_ETH_SYMBOL = 'TESTETH';

export const ETH_TOKEN_IMAGE_URL = './images/eth_logo.svg';
export const TEST_ETH_TOKEN_IMAGE_URL = './images/black-eth-logo.svg';

export const INFURA_PROVIDER_TYPES = [MAINNET];

export const TEST_CHAINS = [LOCALHOST_CHAIN_ID];

/**
 * Map of all build-in Infura networks to their network and chain IDs.
 */
export const NETWORK_TYPE_TO_ID_MAP = {
  [MAINNET]: { networkId: MAINNET_NETWORK_ID, chainId: MAINNET_CHAIN_ID },
  [LOCALHOST]: { networkId: LOCALHOST_NETWORK_ID, chainId: LOCALHOST_CHAIN_ID },
};

export const NETWORK_TO_NAME_MAP = {
  [MAINNET]: MAINNET_DISPLAY_NAME,
  [LOCALHOST]: LOCALHOST_DISPLAY_NAME,

  [MAINNET_NETWORK_ID]: MAINNET_DISPLAY_NAME,
  [LOCALHOST_NETWORK_ID]: LOCALHOST_DISPLAY_NAME,

  [MAINNET_CHAIN_ID]: MAINNET_DISPLAY_NAME,
  [LOCALHOST_CHAIN_ID]: LOCALHOST_DISPLAY_NAME,
};

export const CHAIN_ID_TO_TYPE_MAP = Object.entries(
  NETWORK_TYPE_TO_ID_MAP,
).reduce((chainIdToTypeMap, [networkType, { chainId }]) => {
  chainIdToTypeMap[chainId] = networkType;
  return chainIdToTypeMap;
}, {});

export const CHAIN_ID_TO_RPC_URL_MAP = {
  [MAINNET_CHAIN_ID]: MAINNET_RPC_URL,
  [LOCALHOST_CHAIN_ID]: LOCALHOST_RPC_URL,
};

export const CHAIN_ID_TO_NETWORK_ID_MAP = Object.values(
  NETWORK_TYPE_TO_ID_MAP,
).reduce((chainIdToNetworkIdMap, { chainId, networkId }) => {
  chainIdToNetworkIdMap[chainId] = networkId;
  return chainIdToNetworkIdMap;
}, {});

export const NATIVE_CURRENCY_TOKEN_IMAGE_MAP = {
  [ETH_SYMBOL]: ETH_TOKEN_IMAGE_URL,
  [TEST_ETH_SYMBOL]: TEST_ETH_TOKEN_IMAGE_URL,
};

export const INFURA_BLOCKED_KEY = 'countryBlocked';

/**
 * Hardforks are points in the chain where logic is changed significantly
 * enough where there is a fork and the new fork becomes the active chain.
 * These constants are presented in chronological order starting with BERLIN
 * because when we first needed to track the hardfork we had launched support
 * for EIP-2718 (where transactions can have types and different shapes) and
 * EIP-2930 (optional access lists), which were included in BERLIN.
 *
 * BERLIN - forked at block number 12,244,000, included typed transactions and
 *  optional access lists
 * LONDON - future, upcoming fork that introduces the baseFeePerGas, an amount
 *  of the UBQ transaction fees that will be burned instead of given to the
 *  miner. This change necessitated the third type of transaction envelope to
 *  specify maxFeePerGas and maxPriorityFeePerGas moving the fee bidding system
 *  to a second price auction model.
 */
export const HARDFORKS = {
  BERLIN: 'berlin',
  LONDON: 'london',
};

/**
 * Ethereum JSON-RPC methods that are known to exist but that we intentionally
 * do not support.
 */
export const UNSUPPORTED_RPC_METHODS = new Set([
  // This is implemented later in our middleware stack – specifically, in
  // eth-json-rpc-middleware – but our UI does not support it.
  'eth_signTransaction',
]);

export const IPFS_DEFAULT_GATEWAY_URL = 'dweb.link';

// The first item in transakCurrencies must be the
// default crypto currency for the network
const BUYABLE_CHAIN_ETHEREUM_NETWORK_NAME = 'ethereum';

export const BUYABLE_CHAINS_MAP = {
  [MAINNET_CHAIN_ID]: {
    nativeCurrency: ETH_SYMBOL,
    network: BUYABLE_CHAIN_ETHEREUM_NETWORK_NAME,
  },
};
