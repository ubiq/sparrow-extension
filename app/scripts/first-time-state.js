/**
 * @typedef {Object} FirstTimeState
 * @property {Object} config Initial configuration parameters
 * @property {Object} NetworkController Network controller state
 */

/**
 * @type {FirstTimeState}
 */
const initialState = {
  config: {},
  PreferencesController: {
    frequentRpcListDetail: [
      {
        rpcUrl: 'http://localhost:8588',
        chainId: '0x539',
        ticker: 'ETH',
        nickname: 'Localhost 8588',
        rpcPrefs: {},
      },
    ],
  },
};

export default initialState;
