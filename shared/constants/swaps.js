import {
  MAINNET_CHAIN_ID,
  ETH_SYMBOL,
  TEST_ETH_SYMBOL,
  TEST_ETH_TOKEN_IMAGE_URL,
} from './network';

export const QUOTES_EXPIRED_ERROR = 'quotes-expired';
export const SWAP_FAILED_ERROR = 'swap-failed-error';
export const ERROR_FETCHING_QUOTES = 'error-fetching-quotes';
export const QUOTES_NOT_AVAILABLE_ERROR = 'quotes-not-avilable';
export const CONTRACT_DATA_DISABLED_ERROR = 'contract-data-disabled';
export const OFFLINE_FOR_MAINTENANCE = 'offline-for-maintenance';
export const SWAPS_FETCH_ORDER_CONFLICT = 'swaps-fetch-order-conflict';

// An address that the metaswap-api recognizes as the default token for the current network, in place of the token address that ERC-20 tokens have
const DEFAULT_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ETH_SWAPS_TOKEN_OBJECT = {
  symbol: ETH_SYMBOL,
  name: 'Ether',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: './images/black-eth-logo.svg',
};

export const TEST_ETH_SWAPS_TOKEN_OBJECT = {
  symbol: TEST_ETH_SYMBOL,
  name: 'Test Ether',
  address: DEFAULT_TOKEN_ADDRESS,
  decimals: 18,
  iconUrl: TEST_ETH_TOKEN_IMAGE_URL,
};

// A gas value for ERC20 approve calls that should be sufficient for all ERC20 approve implementations
export const DEFAULT_ERC20_APPROVE_GAS = '0x1d4c0';

const MAINNET_CONTRACT_ADDRESS = '0x881d40237659c251811cec9c364ef91dc08d300c';

const TESTNET_CONTRACT_ADDRESS = '0x881d40237659c251811cec9c364ef91dc08d300c';

export const WETH_CONTRACT_ADDRESS =
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const SWAPS_TESTNET_CHAIN_ID = '0x539';

export const SWAPS_API_V2_BASE_URL = 'https://swap.metaswap.codefi.network';
export const SWAPS_DEV_API_V2_BASE_URL =
  'https://swap.metaswap-dev.codefi.network';
export const GAS_API_BASE_URL = 'https://gas-api.metaswap.codefi.network';
export const GAS_DEV_API_BASE_URL =
  'https://gas-api.metaswap-dev.codefi.network';

const MAINNET_DEFAULT_BLOCK_EXPLORER_URL = 'https://ubiqscan.io/';

export const ALLOWED_PROD_SWAPS_CHAIN_IDS = [
  MAINNET_CHAIN_ID,
  SWAPS_TESTNET_CHAIN_ID,
];

export const ALLOWED_DEV_SWAPS_CHAIN_IDS = [
  ...ALLOWED_PROD_SWAPS_CHAIN_IDS,
  RINKEBY_CHAIN_ID,
];

export const ALLOWED_SMART_TRANSACTIONS_CHAIN_IDS = [MAINNET_CHAIN_ID];

export const SWAPS_CHAINID_CONTRACT_ADDRESS_MAP = {
  [MAINNET_CHAIN_ID]: MAINNET_CONTRACT_ADDRESS,
  [SWAPS_TESTNET_CHAIN_ID]: TESTNET_CONTRACT_ADDRESS,
};

export const SWAPS_WRAPPED_TOKENS_ADDRESSES = {
  [MAINNET_CHAIN_ID]: WETH_CONTRACT_ADDRESS,
  [SWAPS_TESTNET_CHAIN_ID]: WETH_CONTRACT_ADDRESS,
};

export const ALLOWED_CONTRACT_ADDRESSES = {
  [MAINNET_CHAIN_ID]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[MAINNET_CHAIN_ID],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[MAINNET_CHAIN_ID],
  ],
  [SWAPS_TESTNET_CHAIN_ID]: [
    SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[SWAPS_TESTNET_CHAIN_ID],
    SWAPS_WRAPPED_TOKENS_ADDRESSES[SWAPS_TESTNET_CHAIN_ID],
  ],
};

export const SWAPS_CHAINID_DEFAULT_TOKEN_MAP = {
  [MAINNET_CHAIN_ID]: ETH_SWAPS_TOKEN_OBJECT,
  [SWAPS_TESTNET_CHAIN_ID]: TEST_ETH_SWAPS_TOKEN_OBJECT,
};

export const SWAPS_CHAINID_DEFAULT_BLOCK_EXPLORER_URL_MAP = {
  [MAINNET_CHAIN_ID]: MAINNET_DEFAULT_BLOCK_EXPLORER_URL,
};

export const ETHEREUM = 'ethereum';

export const SWAPS_CLIENT_ID = 'extension';

export const TOKEN_BUCKET_PRIORITY = {
  OWNED: 'owned',
  TOP: 'top',
};

export const SLIPPAGE = {
  DEFAULT: 2,
  HIGH: 3,
};
