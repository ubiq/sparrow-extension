import React from 'react';
import configureMockStore from 'redux-mock-store';
import { renderWithProvider } from '../../../../../test/jest/rendering';
import { defaultNetworksData } from '../networks-tab.constants';
import NetworksListItem from '.';

const mockState = {
  metamask: {
    provider: {
      chainId: '0x4',
      nickname: '',
      rpcPrefs: {},
      rpcUrl: 'https://rinkeby.infura.io/v3/undefined',
      ticker: 'UBQ',
      type: 'rinkeby',
    },
  },
};

const renderComponent = (props) => {
  const store = configureMockStore([])(mockState);
  return renderWithProvider(<NetworksListItem {...props} />, store);
};

const defaultNetworks = defaultNetworksData.map((network) => ({
  ...network,
  viewOnly: true,
}));

const MainnetProps = {
  network: defaultNetworks[0],
  networkIsSelected: false,
  selectedRpcUrl: 'http://localhost:8588',
};
const testNetProps = {
  network: defaultNetworks[1],
  networkIsSelected: false,
  selectedRpcUrl: 'http://localhost:8588',
};

describe('NetworksListItem Component', () => {
  it('should render a Mainnet network item correctly', () => {
    const { queryByText } = renderComponent(MainnetProps);
    expect(queryByText('Ethereum Mainnet')).toBeInTheDocument();
  });

  it('should render a test network item correctly', () => {
    const { queryByText } = renderComponent(testNetProps);
    expect(queryByText('Ropsten Test Network')).toBeInTheDocument();
  });
});
