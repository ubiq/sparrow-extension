import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { useSelector } from 'react-redux';

import {
  renderWithProvider,
  createSwapsMockStore,
  setBackgroundConnection,
  MOCKS,
} from '../../../../test/jest';
import { EDIT_GAS_MODES } from '../../../../shared/constants/gas';
import { MAINNET_CHAIN_ID } from '../../../../shared/constants/network';

import {
  checkNetworkAndAccountSupports1559,
  getEIP1559V2Enabled,
  getPreferences,
  getSelectedAccount,
} from '../../../selectors';
import {
  getGasEstimateType,
  getGasFeeEstimates,
  getIsGasEstimatesLoading,
} from '../../../ducks/metamask/metamask';
import { GasFeeContextProvider } from '../../../contexts/gasFee';
import { TRANSACTION_ENVELOPE_TYPE_NAMES } from '../../../helpers/constants/transactions';
import { useGasFeeEstimates } from '../../../hooks/useGasFeeEstimates';

import FeeCard from '.';

const middleware = [thunk];

jest.mock('../../../hooks/useGasFeeEstimates', () => ({
  useGasFeeEstimates: jest.fn(),
}));

jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');

  return {
    ...actual,
    useSelector: jest.fn(),
  };
});

const generateUseSelectorRouter = () => (selector) => {
  if (selector === checkNetworkAndAccountSupports1559) {
    return true;
  }
  if (selector === getGasEstimateType) {
    return TRANSACTION_ENVELOPE_TYPE_NAMES.FEE_MARKET;
  }
  if (selector === getGasFeeEstimates) {
    return MOCKS.createGasFeeEstimatesForFeeMarket();
  }
  if (selector === getIsGasEstimatesLoading) {
    return false;
  }
  return undefined;
};

setBackgroundConnection({
  getGasFeeTimeEstimate: jest.fn(),
  getGasFeeEstimatesAndStartPolling: jest.fn(),
  createTransactionEventFragment: jest.fn(),
});

const createProps = (customProps = {}) => {
  return {
    primaryFee: {
      fee: '0.0441 ETH',
      maxFee: '0.04851 ETH',
    },
    secondaryFee: {
      fee: '$101.98',
      maxFee: '$112.17',
    },
    hideTokenApprovalRow: false,
    onFeeCardMaxRowClick: jest.fn(),
    tokenApprovalTextComponent: (
      <span key="fee-card-approve-symbol" className="fee-card__bold">
        ABC
      </span>
    ),
    tokenApprovalSourceTokenSymbol: 'ABC',
    onTokenApprovalClick: jest.fn(),
    metaMaskFee: '0.875',
    isBestQuote: true,
    numberOfQuotes: 6,
    onQuotesClick: jest.fn(),
    tokenConversionRate: 0.015,
    chainId: MAINNET_CHAIN_ID,
    networkAndAccountSupports1559: false,
    supportsEIP1559V2: false,
    ...customProps,
  };
};

describe('FeeCard', () => {
  it('renders the component with initial props', () => {
    useSelector.mockImplementation(generateUseSelectorRouter());
    const props = createProps();
    const { getByText } = renderWithProvider(<FeeCard {...props} />);
    expect(getByText('Best of 6 quotes.')).toBeInTheDocument();
    expect(getByText('Estimated gas fee')).toBeInTheDocument();
    expect(getByText('Max fee')).toBeInTheDocument();
    expect(getByText(props.primaryFee.fee)).toBeInTheDocument();
    expect(getByText(props.secondaryFee.fee)).toBeInTheDocument();
    expect(getByText(`: ${props.secondaryFee.maxFee}`)).toBeInTheDocument();
    expect(getByText('Includes a 0.875% Sparrow fee.')).toBeInTheDocument();
    expect(
      document.querySelector('.fee-card__top-bordered-row'),
    ).toMatchSnapshot();
  });

  it('renders the component with EIP-1559 enabled', () => {
    const store = configureMockStore(middleware)(createSwapsMockStore());
    const props = createProps({
      networkAndAccountSupports1559: true,
      maxPriorityFeePerGasDecGWEI: '3',
      maxFeePerGasDecGWEI: '4',
    });
    const { getByText } = renderWithProvider(<FeeCard {...props} />, store);
    expect(getByText('Best of 6 quotes.')).toBeInTheDocument();
    expect(getByText('Estimated gas fee')).toBeInTheDocument();
    expect(getByText('Max fee')).toBeInTheDocument();
    expect(getByText(props.primaryFee.fee)).toBeInTheDocument();
    expect(getByText(props.secondaryFee.fee)).toBeInTheDocument();
    expect(getByText(`: ${props.secondaryFee.maxFee}`)).toBeInTheDocument();
    expect(getByText('Includes a 0.875% Sparrow fee.')).toBeInTheDocument();
    expect(
      document.querySelector('.fee-card__top-bordered-row'),
    ).toMatchSnapshot();
  });

  it('renders the component with EIP-1559 V2 enabled', () => {
    useGasFeeEstimates.mockImplementation(() => ({ gasFeeEstimates: {} }));
    useSelector.mockImplementation((selector) => {
      if (selector === getPreferences) {
        return {
          useNativeCurrencyAsPrimaryCurrency: true,
        };
      }
      if (selector === getEIP1559V2Enabled) {
        return true;
      }
      if (selector === getSelectedAccount) {
        return {
          balance: '0x440aa47cc2556',
        };
      }
      if (selector === checkNetworkAndAccountSupports1559) {
        return true;
      }
      return undefined;
    });

    const store = configureMockStore(middleware)(createSwapsMockStore());
    const props = createProps({
      networkAndAccountSupports1559: true,
      maxPriorityFeePerGasDecGWEI: '3',
      maxFeePerGasDecGWEI: '4',
      supportsEIP1559V2: true,
    });
    const { getByText } = renderWithProvider(
      <GasFeeContextProvider
        transaction={{ txParams: {}, userFeeLevel: 'high' }}
        editGasMode={EDIT_GAS_MODES.SWAPS}
      >
        <FeeCard {...props} />
      </GasFeeContextProvider>,
      store,
    );
    expect(getByText('Best of 6 quotes.')).toBeInTheDocument();
    expect(getByText('Gas')).toBeInTheDocument();
    expect(getByText('(estimated)')).toBeInTheDocument();
    expect(getByText('Swap suggested')).toBeInTheDocument();
    expect(getByText('Max fee')).toBeInTheDocument();
    expect(getByText(props.primaryFee.fee)).toBeInTheDocument();
    expect(getByText(props.secondaryFee.fee)).toBeInTheDocument();
    expect(getByText(`: ${props.secondaryFee.maxFee}`)).toBeInTheDocument();
    expect(getByText('Includes a 0.875% Sparrow fee.')).toBeInTheDocument();
    expect(
      document.querySelector('.fee-card__top-bordered-row'),
    ).toMatchSnapshot();
  });
});
