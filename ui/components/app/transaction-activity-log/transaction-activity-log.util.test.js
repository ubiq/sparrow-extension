import { GAS_LIMITS } from '../../../../shared/constants/gas';
import { TRANSACTION_STATUSES } from '../../../../shared/constants/transaction';
import {
  combineTransactionHistories,
  getActivities,
} from './transaction-activity-log.util';

describe('TransactionActivityLog utils', () => {
  describe('combineTransactionHistories', () => {
    it('should return no activities for an empty list of transactions', () => {
      expect(combineTransactionHistories([])).toStrictEqual([]);
    });
  });

  describe('getActivities', () => {
    it('should return no activities for an empty history', () => {
      const transaction = {
        history: [],
        id: 1,
        status: TRANSACTION_STATUSES.CONFIRMED,
        txParams: {
          from: '0x1',
          gas: GAS_LIMITS.SIMPLE,
          gasPrice: '0x3b9aca00',
          nonce: '0xa4',
          to: '0x2',
          value: '0x2386f26fc10000',
        },
      };

      expect(getActivities(transaction)).toStrictEqual([]);
    });
  });
});
