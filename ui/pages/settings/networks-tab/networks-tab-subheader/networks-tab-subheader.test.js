import React from 'react';
import configureMockStore from 'redux-mock-store';
import { renderWithProvider } from '../../../../../test/jest/rendering';
import NetworksTabSubheader from '.';

const mockState = {
  metamask: {
    provider: {
      chainId: '0x539',
      nickname: '',
      rpcPrefs: {},
      rpcUrl: 'http://localhost:8588',
      ticker: 'UBQ',
      type: 'localhost',
    },
    frequentRpcListDetail: [],
  },
  appState: {
    networksTabSelectedRpcUrl: 'http://localhost:8588',
  },
};

const renderComponent = (props) => {
  const store = configureMockStore([])(mockState);
  return renderWithProvider(<NetworksTabSubheader {...props} />, store);
};

describe('NetworksTabSubheader Component', () => {
  it('should render network subheader correctly', () => {
    const { queryByText, getByRole } = renderComponent({
      addNewNetwork: false,
    });

    expect(queryByText('Networks')).toBeInTheDocument();
    expect(queryByText('Add a network')).toBeInTheDocument();
    expect(getByRole('button', { text: 'Add a network' })).toBeDefined();
  });
  it('should render add network form subheader correctly', () => {
    const { queryByText } = renderComponent({
      addNewNetwork: true,
    });
    expect(queryByText('Networks')).toBeInTheDocument();
    expect(queryByText('>')).toBeInTheDocument();
    expect(queryByText('Add a network')).toBeInTheDocument();
  });
});
