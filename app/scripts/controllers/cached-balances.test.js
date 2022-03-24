import { strict as assert } from 'assert';
import sinon from 'sinon';
import CachedBalancesController from './cached-balances';

describe('CachedBalancesController', function () {
  describe('updateCachedBalances', function () {
    it('should update the cached balances', async function () {
      const controller = new CachedBalancesController({
        accountTracker: {
          store: {
            subscribe: () => undefined,
          },
        },
        initState: {
          cachedBalances: 'mockCachedBalances',
        },
      });

      controller._generateBalancesToCache = sinon
        .stub()
        .callsFake(() => Promise.resolve('mockNewCachedBalances'));

      await controller.updateCachedBalances({ accounts: 'mockAccounts' });

      assert.equal(controller._generateBalancesToCache.callCount, 1);
      assert.equal(
        controller.store.getState().cachedBalances,
        'mockNewCachedBalances',
      );
    });
  });
});
