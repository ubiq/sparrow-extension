import { MESSAGE_TYPE } from '../../../../../shared/constants/app';

/**
 * This RPC method is called by the inpage provider whenever it detects the
 * accessing of a non-existent property on our window.web3 shim.
 * We collect this data to understand which sites are breaking due to the
 * removal of our window.web3.
 */

const logWeb3ShimUsage = {
  methodNames: [MESSAGE_TYPE.LOG_WEB3_SHIM_USAGE],
  implementation: logWeb3ShimUsageHandler,
  hookNames: {
    getWeb3ShimUsageState: true,
    setWeb3ShimUsageRecorded: true,
  },
};
export default logWeb3ShimUsage;

/**
 * @typedef {Object} LogWeb3ShimUsageOptions
 * @property {Function} getWeb3ShimUsageState - A function that gets web3 shim
 * usage state for the given origin.
 * @property {Function} setWeb3ShimUsageRecorded - A function that records web3 shim
 * usage for a particular origin.
 */

/**
 * @param {import('json-rpc-engine').JsonRpcRequest<unknown>} req - The JSON-RPC request object.
 * @param {import('json-rpc-engine').JsonRpcResponse<true>} res - The JSON-RPC response object.
 * @param {Function} _next - The json-rpc-engine 'next' callback.
 * @param {Function} end - The json-rpc-engine 'end' callback.
 * @param {LogWeb3ShimUsageOptions} options
 */
function logWeb3ShimUsageHandler(
  req,
  res,
  _next,
  end,
  { getWeb3ShimUsageState, setWeb3ShimUsageRecorded },
) {
  const { origin } = req;
  if (getWeb3ShimUsageState(origin) === undefined) {
    setWeb3ShimUsageRecorded(origin);
  }

  res.result = true;
  return end();
}
