/**
 * Create a Coinbase Pay Checkout URL.
 *
 * @param {string} walletAddress - Ethereum destination address
 * @param {string} chainId - Current chain ID
 * @returns String
 */
const createCoinbasePayUrl = (walletAddress, chainId) => {
  const { coinbasePayCurrencies } = BUYABLE_CHAINS_MAP[chainId];
  const queryParams = new URLSearchParams({
    appId: COINBASEPAY_API_KEY,
    attribution: 'extension',
    destinationWallets: JSON.stringify([
      {
        address: walletAddress,
        assets: coinbasePayCurrencies,
      },
    ]),
  });
  return `https://pay.coinbase.com/buy?${queryParams}`;
};

/**
 * Gives the caller a url at which the user can acquire eth, depending on the network they are in
 *
 * @param {object} opts - Options required to determine the correct url
 * @param {string} opts.chainId - The chainId for which to return a url
 * @param opts.service
 * @returns {string|undefined} The url at which the user can access UBQ, while in the given chain. If the passed
 * chainId does not match any of the specified cases, or if no chainId is given, returns undefined.
 */
export default async function getBuyUrl({ chainId, service }) {
  // default service by network if not specified
  if (!service) {
    // eslint-disable-next-line no-param-reassign
    service = getDefaultServiceForChain(chainId);
  }

  switch (service) {
    // case 'coinbase': TODO(iquidus): one day
    //   return createCoinbasePayUrl(address, chainId);
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
    default:
      throw new Error(
        `No default cryptocurrency exchange or faucet for chainId: "${chainId}"`,
      );
  }
}
