/* eslint-disable import/unambiguous */
let mapStateToProps;

jest.mock('react-redux', () => ({
  connect: (ms) => {
    mapStateToProps = ms;
    return () => ({});
  },
}));

require('./transaction-activity-log.container.js');

describe('TransactionActivityLog container', () => {
  describe('mapStateToProps()', () => {
    it('should return the correct props', () => {
      const mockState = {
        metamask: {
          conversionRate: 280.45,
          nativeCurrency: 'UBQ',
          frequentRpcListDetail: [],
        },
      };

      expect(mapStateToProps(mockState)).toStrictEqual({
        conversionRate: 280.45,
        nativeCurrency: 'UBQ',
        rpcPrefs: {},
      });
    });

    it('should return the correct props when on a custom network', () => {
      const mockState = {
        metamask: {
          conversionRate: 280.45,
          nativeCurrency: 'UBQ',
          frequentRpcListDetail: [
            {
              rpcUrl: 'https://customnetwork.com/',
              rpcPrefs: {
                blockExplorerUrl: 'https://customblockexplorer.com/',
              },
            },
          ],
          provider: {
            rpcUrl: 'https://customnetwork.com/',
          },
        },
      };

      expect(mapStateToProps(mockState)).toStrictEqual({
        conversionRate: 280.45,
        nativeCurrency: 'UBQ',
        rpcPrefs: {
          blockExplorerUrl: 'https://customblockexplorer.com/',
        },
      });
    });
  });
});
