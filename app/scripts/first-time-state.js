/**
 * @typedef {object} FirstTimeState
 * @property {object} config Initial configuration parameters
 * @property {object} NetworkController Network controller state
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
        chainId: '0x8',
        ticker: 'UBQ',
        nickname: 'Localhost 8588',
        rpcPrefs: {},
      },
    ],
  },
  CurrencyController: {
    nativeCurrency: 'UBQ',
  },
};

export default initialState;
