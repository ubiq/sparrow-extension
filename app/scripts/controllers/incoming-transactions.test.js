import { strict as assert } from 'assert';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import nock from 'nock';

import waitUntilCalled from '../../../test/lib/wait-until-called';
import {
  CHAIN_ID_TO_TYPE_MAP,
  MAINNET_CHAIN_ID,
} from '../../../shared/constants/network';
import { MILLISECOND } from '../../../shared/constants/time';

const IncomingTransactionsController = proxyquire('./incoming-transactions', {
  '../../../shared/modules/random-id': { default: () => 54321 },
}).default;

const FAKE_CHAIN_ID = '0x1338';
const MOCK_SELECTED_ADDRESS = '0x0101';
const SET_STATE_TIMEOUT = MILLISECOND * 10;

const EXISTING_INCOMING_TX = { id: 777, hash: '0x123456' };
const PREPOPULATED_INCOMING_TXS_BY_HASH = {
  [EXISTING_INCOMING_TX.hash]: EXISTING_INCOMING_TX,
};
const PREPOPULATED_BLOCKS_BY_NETWORK = {
  [MAINNET_CHAIN_ID]: 3,
};
const EMPTY_BLOCKS_BY_NETWORK = {
  [MAINNET_CHAIN_ID]: null,
};

function getEmptyInitState() {
  return {
    incomingTransactions: {},
    incomingTxLastFetchedBlockByChainId: EMPTY_BLOCKS_BY_NETWORK,
  };
}

function getNonEmptyInitState() {
  return {
    incomingTransactions: PREPOPULATED_INCOMING_TXS_BY_HASH,
    incomingTxLastFetchedBlockByChainId: PREPOPULATED_BLOCKS_BY_NETWORK,
  };
}

function getMockNetworkControllerMethods(chainId = FAKE_CHAIN_ID) {
  return {
    getCurrentChainId: () => chainId,
    onNetworkDidChange: sinon.spy(),
  };
}

function getMockPreferencesController({
  showIncomingTransactions = true,
} = {}) {
  return {
    getSelectedAddress: sinon.stub().returns(MOCK_SELECTED_ADDRESS),
    store: {
      getState: sinon.stub().returns({
        featureFlags: {
          showIncomingTransactions,
        },
      }),
      subscribe: sinon.spy(),
    },
  };
}

function getMockBlockTracker() {
  return {
    addListener: sinon.stub().callsArgWithAsync(1, '0xa'),
    removeListener: sinon.spy(),
    testProperty: 'fakeBlockTracker',
    getCurrentBlock: () => '0xa',
  };
}

/**
 * @typedef {import(
 *  '../../../../app/scripts/controllers/incoming-transactions'
 * ).EtherscanTransaction} EtherscanTransaction
 */

/**
 * Returns a transaction object matching the expected format returned
 * by the Ubiqscan API
 *
 * @param {Object} [params] - options bag
 * @param {string} [params.toAddress] - The hex-prefixed address of the recipient
 * @param {number} [params.blockNumber] - The block number for the transaction
 * @param {boolean} [params.useEIP1559] - Use EIP-1559 gas fields
 * @param params.hash
 * @returns {EtherscanTransaction}
 */
const getFakeEtherscanTransaction = ({
  toAddress = MOCK_SELECTED_ADDRESS,
  blockNumber = 10,
  useEIP1559 = false,
  hash = '0xfake',
} = {}) => {
  if (useEIP1559) {
    return {
      blockNumber: blockNumber.toString(),
      from: '0xfake',
      gas: '0',
      maxFeePerGas: '10',
      maxPriorityFeePerGas: '1',
      hash,
      isError: '0',
      nonce: '100',
      timeStamp: '16000000000000',
      to: toAddress,
      value: '0',
    };
  }
  return {
    blockNumber: blockNumber.toString(),
    from: '0xfake',
    gas: '0',
    gasPrice: '0',
    hash: '0xfake',
    isError: '0',
    nonce: '100',
    timeStamp: '16000000000000',
    to: toAddress,
    value: '0',
  };
};

function nockEtherscanApiForAllChains(mockResponse) {
  for (const chainId of [MAINNET_CHAIN_ID, 'undefined']) {
    nock(
      `https://api${
        chainId === MAINNET_CHAIN_ID ? '' : `-${CHAIN_ID_TO_TYPE_MAP[chainId]}`
      }.etherscan.io`,
    )
      .get(/api.+/u)
      .reply(200, JSON.stringify(mockResponse));
  }
}

describe('IncomingTransactionsController', function () {
  afterEach(function () {
    sinon.restore();
    nock.cleanAll();
  });

  describe('constructor', function () {
    it('should set up correct store, listeners and properties in the constructor', function () {
      const mockedNetworkMethods = getMockNetworkControllerMethods();
      const incomingTransactionsController = new IncomingTransactionsController(
        {
          blockTracker: getMockBlockTracker(),
          ...mockedNetworkMethods,
          preferencesController: getMockPreferencesController(),
          initState: {},
        },
      );
      sinon.spy(incomingTransactionsController, '_update');

      assert.deepStrictEqual(
        incomingTransactionsController.store.getState(),
        getEmptyInitState(),
      );

      assert(mockedNetworkMethods.onNetworkDidChange.calledOnce);
      const networkControllerListenerCallback = mockedNetworkMethods.onNetworkDidChange.getCall(
        0,
      ).args[0];
      assert.strictEqual(incomingTransactionsController._update.callCount, 0);
      networkControllerListenerCallback('testNetworkType');
      assert.strictEqual(incomingTransactionsController._update.callCount, 1);
      assert.deepStrictEqual(
        incomingTransactionsController._update.getCall(0).args[0],
        '0x0101',
      );

      incomingTransactionsController._update.resetHistory();
    });

    it('should set the store to a provided initial state', function () {
      const incomingTransactionsController = new IncomingTransactionsController(
        {
          blockTracker: getMockBlockTracker(),
          ...getMockNetworkControllerMethods(),
          preferencesController: getMockPreferencesController(),
          initState: getNonEmptyInitState(),
        },
      );

      assert.deepStrictEqual(
        incomingTransactionsController.store.getState(),
        getNonEmptyInitState(),
      );
    });
  });

  describe('update events', function () {
    it('should set up a listener for the latest block', async function () {
      const incomingTransactionsController = new IncomingTransactionsController(
        {
          blockTracker: getMockBlockTracker(),
          ...getMockNetworkControllerMethods(),
          preferencesController: getMockPreferencesController(),
          initState: {},
        },
      );

      incomingTransactionsController.start();

      assert(
        incomingTransactionsController.blockTracker.addListener.calledOnce,
      );
      assert.strictEqual(
        incomingTransactionsController.blockTracker.addListener.getCall(0)
          .args[0],
        'latest',
      );
    });

    it('should not update upon latest block when started and not on supported network', async function () {
      const incomingTransactionsController = new IncomingTransactionsController(
        {
          blockTracker: getMockBlockTracker(),
          ...getMockNetworkControllerMethods(),
          preferencesController: getMockPreferencesController(),
          initState: getNonEmptyInitState(),
        },
      );
      // reply with a valid request for any supported network, so that this test has every opportunity to fail
      nockEtherscanApiForAllChains({
        status: '1',
        result: [getFakeEtherscanTransaction()],
      });

      const updateStateStub = sinon.stub(
        incomingTransactionsController.store,
        'updateState',
      );
      const updateStateCalled = waitUntilCalled(
        updateStateStub,
        incomingTransactionsController.store,
      );
      const putStateStub = sinon.stub(
        incomingTransactionsController.store,
        'putState',
      );
      const putStateCalled = waitUntilCalled(
        putStateStub,
        incomingTransactionsController.store,
      );

      incomingTransactionsController.start();

      try {
        await Promise.race([
          updateStateCalled(),
          putStateCalled(),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('TIMEOUT')), SET_STATE_TIMEOUT);
          }),
        ]);
        assert.fail('Update state should not have been called');
      } catch (error) {
        assert(error.message === 'TIMEOUT', 'TIMEOUT error should be thrown');
      }
    });

    it('should not update upon latest block when started and incoming transactions disabled', async function () {
      const incomingTransactionsController = new IncomingTransactionsController(
        {
          blockTracker: getMockBlockTracker(),
          ...getMockNetworkControllerMethods(),
          preferencesController: getMockPreferencesController({
            showIncomingTransactions: false,
          }),
          initState: getNonEmptyInitState(),
        },
      );
      // reply with a valid request for any supported network, so that this test has every opportunity to fail
      nockEtherscanApiForAllChains({
        status: '1',
        result: [getFakeEtherscanTransaction()],
      });
      const updateStateStub = sinon.stub(
        incomingTransactionsController.store,
        'updateState',
      );
      const updateStateCalled = waitUntilCalled(
        updateStateStub,
        incomingTransactionsController.store,
      );
      const putStateStub = sinon.stub(
        incomingTransactionsController.store,
        'putState',
      );
      const putStateCalled = waitUntilCalled(
        putStateStub,
        incomingTransactionsController.store,
      );

      incomingTransactionsController.start();

      try {
        await Promise.race([
          updateStateCalled(),
          putStateCalled(),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('TIMEOUT')), SET_STATE_TIMEOUT);
          }),
        ]);
        assert.fail('Update state should not have been called');
      } catch (error) {
        assert(error.message === 'TIMEOUT', 'TIMEOUT error should be thrown');
      }
    });

    it('should not update when the selected address changes and not on supported network', async function () {
      const incomingTransactionsController = new IncomingTransactionsController(
        {
          blockTracker: { ...getMockBlockTracker() },
          ...getMockNetworkControllerMethods(),
          preferencesController: getMockPreferencesController(),
          initState: getNonEmptyInitState(),
        },
      );
      const NEW_MOCK_SELECTED_ADDRESS = `${MOCK_SELECTED_ADDRESS}9`;
      // reply with a valid request for any supported network, so that this test has every opportunity to fail
      nockEtherscanApiForAllChains({
        status: '1',
        result: [
          getFakeEtherscanTransaction({ toAddress: NEW_MOCK_SELECTED_ADDRESS }),
        ],
      });
      const updateStateStub = sinon.stub(
        incomingTransactionsController.store,
        'updateState',
      );
      const updateStateCalled = waitUntilCalled(
        updateStateStub,
        incomingTransactionsController.store,
      );
      const putStateStub = sinon.stub(
        incomingTransactionsController.store,
        'putState',
      );
      const putStateCalled = waitUntilCalled(
        putStateStub,
        incomingTransactionsController.store,
      );

      const subscription = incomingTransactionsController.preferencesController.store.subscribe.getCall(
        1,
      ).args[0];
      // The incoming transactions controller will always skip the first event
      // We need to call subscription twice to test the event handling
      // TODO: stop skipping the first event
      await subscription({ selectedAddress: MOCK_SELECTED_ADDRESS });
      await subscription({ selectedAddress: NEW_MOCK_SELECTED_ADDRESS });

      try {
        await Promise.race([
          updateStateCalled(),
          putStateCalled(),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('TIMEOUT')), SET_STATE_TIMEOUT);
          }),
        ]);
        assert.fail('Update state should not have been called');
      } catch (error) {
        assert(error.message === 'TIMEOUT', 'TIMEOUT error should be thrown');
      }
    });
  });
});
