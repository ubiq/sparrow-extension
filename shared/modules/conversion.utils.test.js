import BigNumber from 'bignumber.js';
import {
  addCurrencies,
  conversionUtil,
  divideCurrencies,
} from './conversion.utils';

describe('conversion utils', () => {
  describe('addCurrencies()', () => {
    it('add whole numbers', () => {
      const result = addCurrencies(3, 9, {
        aBase: 10,
        bBase: 10,
      });
      expect(result.toNumber()).toStrictEqual(12);
    });

    it('add decimals', () => {
      const result = addCurrencies(1.3, 1.9, {
        aBase: 10,
        bBase: 10,
      });
      expect(result.toNumber()).toStrictEqual(3.2);
    });

    it('add repeating decimals', () => {
      const result = addCurrencies(1 / 3, 1 / 9, {
        aBase: 10,
        bBase: 10,
      });
      expect(result.toNumber()).toStrictEqual(0.4444444444444444);
    });
  });

  describe('conversionUtil', () => {
    it('returns expected types', () => {
      const conv1 = conversionUtil(1000000000000000000, {
        fromNumericBase: 'dec',
        toNumericBase: 'hex',
      });
      const conv2 = conversionUtil(1, {
        fromNumericBase: 'dec',
        fromDenomination: 'ETH',
        toDenomination: 'WEI',
      });
      expect(typeof conv1 === 'string').toStrictEqual(true);
      expect(conv2 instanceof BigNumber).toStrictEqual(true);
    });
    it('converts from dec to hex', () => {
      expect(
        conversionUtil('1000000000000000000', {
          fromNumericBase: 'dec',
          toNumericBase: 'hex',
        }),
      ).toStrictEqual('de0b6b3a7640000');
      expect(
        conversionUtil('1500000000000000000', {
          fromNumericBase: 'dec',
          toNumericBase: 'hex',
        }),
      ).toStrictEqual('14d1120d7b160000');
    });
    it('converts hex formatted numbers to dec', () => {
      expect(
        conversionUtil('0xde0b6b3a7640000', {
          fromNumericBase: 'hex',
          toNumericBase: 'dec',
        }),
      ).toStrictEqual('1000000000000000000');
      expect(
        conversionUtil('0x14d1120d7b160000', {
          fromNumericBase: 'hex',
          toNumericBase: 'dec',
        }),
      ).toStrictEqual('1500000000000000000');
    });
    it('converts WEI to UBQ', () => {
      expect(
        conversionUtil('0xde0b6b3a7640000', {
          fromNumericBase: 'hex',
          toNumericBase: 'dec',
          fromDenomination: 'WEI',
          toDenomination: 'ETH',
        }),
      ).toStrictEqual('1');
      expect(
        conversionUtil('0x14d1120d7b160000', {
          fromNumericBase: 'hex',
          toNumericBase: 'dec',
          fromDenomination: 'WEI',
          toDenomination: 'ETH',
        }),
      ).toStrictEqual('1.5');
    });
    it('converts UBQ to WEI', () => {
      expect(
        conversionUtil('1', {
          fromNumericBase: 'dec',
          fromDenomination: 'ETH',
          toDenomination: 'WEI',
        }).toNumber(),
      ).toStrictEqual(1000000000000000000);
      expect(
        conversionUtil('1.5', {
          fromNumericBase: 'dec',
          fromDenomination: 'ETH',
          toDenomination: 'WEI',
        }).toNumber(),
      ).toStrictEqual(1500000000000000000);
    });
    it('converts UBQ to GWEI', () => {
      expect(
        conversionUtil('1', {
          fromNumericBase: 'dec',
          fromDenomination: 'ETH',
          toDenomination: 'GWEI',
        }).toNumber(),
      ).toStrictEqual(1000000000);
      expect(
        conversionUtil('1.5', {
          fromNumericBase: 'dec',
          fromDenomination: 'ETH',
          toDenomination: 'GWEI',
        }).toNumber(),
      ).toStrictEqual(1500000000);
    });
    it('converts UBQ to USD', () => {
      expect(
        conversionUtil('1', {
          fromNumericBase: 'dec',
          toNumericBase: 'dec',
          toCurrency: 'usd',
          conversionRate: 468.58,
          numberOfDecimals: 2,
        }),
      ).toStrictEqual('468.58');
      expect(
        conversionUtil('1.5', {
          fromNumericBase: 'dec',
          toNumericBase: 'dec',
          toCurrency: 'usd',
          conversionRate: 468.58,
          numberOfDecimals: 2,
        }),
      ).toStrictEqual('702.87');
    });
    it('converts USD to UBQ', () => {
      expect(
        conversionUtil('468.58', {
          fromNumericBase: 'dec',
          toNumericBase: 'dec',
          toCurrency: 'usd',
          conversionRate: 468.58,
          numberOfDecimals: 2,
          invertConversionRate: true,
        }),
      ).toStrictEqual('1');
      expect(
        conversionUtil('702.87', {
          fromNumericBase: 'dec',
          toNumericBase: 'dec',
          toCurrency: 'usd',
          conversionRate: 468.58,
          numberOfDecimals: 2,
          invertConversionRate: true,
        }),
      ).toStrictEqual('1.5');
    });
  });

  describe('divideCurrencies()', () => {
    it('should correctly divide decimal values', () => {
      const result = divideCurrencies(9, 3, {
        dividendBase: 10,
        divisorBase: 10,
      });
      expect(result.toNumber()).toStrictEqual(3);
    });

    it('should correctly divide hexadecimal values', () => {
      const result = divideCurrencies(1000, 0xa, {
        dividendBase: 16,
        divisorBase: 16,
      });
      expect(result.toNumber()).toStrictEqual(0x100);
    });

    it('should correctly divide hexadecimal value from decimal value', () => {
      const result = divideCurrencies(0x3e8, 0xa, {
        dividendBase: 16,
        divisorBase: 16,
      });
      expect(result.toNumber()).toStrictEqual(0x100);
    });

    it('should throw error for wrong base value', () => {
      expect(() => {
        divideCurrencies(0x3e8, 0xa, {
          dividendBase: 10.5,
          divisorBase: 7,
        });
      }).toThrow('Must specify valid dividendBase and divisorBase');
    });
  });
});
