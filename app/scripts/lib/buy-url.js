import log from 'loglevel';

import { SWAPS_API_V2_BASE_URL } from '../../../shared/constants/swaps';
import {
  MAINNET_CHAIN_ID,
  MAINNET_NETWORK_ID,
  BUYABLE_CHAINS_MAP,
} from '../../../shared/constants/network';
import { SECOND } from '../../../shared/constants/time';
import getFetchWithTimeout from '../../../shared/modules/fetch-with-timeout';
import { TRANSAK_API_KEY } from '../constants/on-ramp';

const fetchWithTimeout = getFetchWithTimeout(SECOND * 30);

/**
 * Create a Wyre purchase URL.
 *
 * @param {string} address - Ethereum destination address
 * @returns String
 */
const createWyrePurchaseUrl = async (address) => {
  const fiatOnRampUrlApi = `${SWAPS_API_V2_BASE_URL}/networks/${MAINNET_NETWORK_ID}/fiatOnRampUrl?serviceName=wyre&destinationAddress=${address}`;
  const wyrePurchaseUrlFallback = `https://pay.sendwyre.com/purchase?dest=ethereum:${address}&destCurrency=ETH&accountId=AC-7AG3W4XH4N2&paymentMethod=debit-card`;
  try {
    const response = await fetchWithTimeout(fiatOnRampUrlApi, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const parsedResponse = await response.json();
    if (response.ok && parsedResponse.url) {
      return parsedResponse.url;
    }
    log.warn('Failed to create a Wyre purchase URL', parsedResponse);
  } catch (err) {
    log.warn('Failed to create a Wyre purchase URL', err);
  }
  return wyrePurchaseUrlFallback; // In case the API call would fail, we return a fallback URL for Wyre's Checkout.
};

/**
 * Create a Transak Checkout URL.
 * API docs here: https://www.notion.so/Query-Parameters-9ec523df3b874ec58cef4fa3a906f238
 *
 * @param {string} walletAddress - Ethereum destination address
 * @param {string} chainId - Current chain ID
 * @returns String
 */
const createTransakUrl = (walletAddress, chainId) => {
  const { transakCurrencies, network } = BUYABLE_CHAINS_MAP[chainId];

  const queryParams = new URLSearchParams({
    apiKey: TRANSAK_API_KEY,
    hostURL: 'https://metamask.io',
    cryptoCurrencyList: transakCurrencies.join(','),
    defaultCryptoCurrency: transakCurrencies[0],
    networks: network,
    walletAddress,
  });

  return `https://global.transak.com/?${queryParams}`;
};

/**
 * Gives the caller a url at which the user can acquire eth, depending on the network they are in
 *
 * @param {Object} opts - Options required to determine the correct url
 * @param {string} opts.chainId - The chainId for which to return a url
 * @param {string} opts.address - The address the bought ETH should be sent to.  Only relevant if chainId === '0x1'.
 * @param opts.service
 * @returns {string|undefined} The url at which the user can access ETH, while in the given chain. If the passed
 * chainId does not match any of the specified cases, or if no chainId is given, returns undefined.
 */
export default async function getBuyUrl({ chainId, address, service }) {
  // default service by network if not specified
  if (!service) {
    // eslint-disable-next-line no-param-reassign
    service = getDefaultServiceForChain(chainId);
  }

  switch (service) {
    case 'wyre':
      return await createWyrePurchaseUrl(address);
    case 'transak':
      return createTransakUrl(address, chainId);
    case 'metamask-faucet':
      return 'https://faucet.metamask.io/';
    default:
      throw new Error(
        `Unknown cryptocurrency exchange or faucet: "${service}"`,
      );
  }
}

function getDefaultServiceForChain(chainId) {
  switch (chainId) {
    case MAINNET_CHAIN_ID:
      return 'wyre';
    default:
      throw new Error(
        `No default cryptocurrency exchange or faucet for chainId: "${chainId}"`,
      );
  }
}
