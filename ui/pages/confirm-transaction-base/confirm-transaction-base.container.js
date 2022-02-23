import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { clearConfirmTransaction } from '../../ducks/confirm-transaction/confirm-transaction.duck';

import {
  updateCustomNonce,
  cancelTx,
  cancelTxs,
  updateAndApproveTx,
  showModal,
  getNextNonce,
  tryReverseResolveAddress,
  setDefaultHomeActiveTabName,
} from '../../store/actions';
import { isBalanceSufficient, calcGasTotal } from '../send/send.utils';
import {
  isEqualCaseInsensitive,
  shortenAddress,
  valuesFor,
} from '../../helpers/utils/util';
import {
  getAdvancedInlineGasShown,
  getCustomNonceValue,
  getIsMainnet,
  getKnownMethodData,
  getMetaMaskAccounts,
  getUseNonceField,
  transactionFeeSelector,
  getNoGasPriceFetched,
  getIsEthGasPriceFetched,
  getShouldShowFiat,
  checkNetworkAndAccountSupports1559,
  getPreferences,
  doesAddressRequireLedgerHidConnection,
  getUseTokenDetection,
  getTokenList,
  getIsMultiLayerFeeNetwork,
  getEIP1559V2Enabled,
} from '../../selectors';
import { getMostRecentOverviewPage } from '../../ducks/history/history';
import {
  isAddressLedger,
  updateTransactionGasFees,
  getIsGasEstimatesLoading,
  getNativeCurrency,
} from '../../ducks/metamask/metamask';

import {
  transactionMatchesNetwork,
  txParamsAreDappSuggested,
} from '../../../shared/modules/transaction.utils';
import { toChecksumHexAddress } from '../../../shared/modules/hexstring-utils';

import { getGasLoadingAnimationIsShowing } from '../../ducks/app/app';
import { isLegacyTransaction } from '../../helpers/utils/transactions.util';
import { CUSTOM_GAS_ESTIMATE } from '../../../shared/constants/gas';
import ConfirmTransactionBase from './confirm-transaction-base.component';

let customNonceValue = '';
const customNonceMerge = (txData) =>
  customNonceValue
    ? {
        ...txData,
        customNonceValue,
      }
    : txData;

const mapStateToProps = (state, ownProps) => {
  const {
    toAddress: propsToAddress,
    customTxParamsData,
    match: { params = {} },
  } = ownProps;
  const { id: paramsTransactionId } = params;
  const isMainnet = getIsMainnet(state);

  const isGasEstimatesLoading = getIsGasEstimatesLoading(state);
  const gasLoadingAnimationIsShowing = getGasLoadingAnimationIsShowing(state);

  const { confirmTransaction, metamask } = state;
  const {
    ensResolutionsByAddress,
    conversionRate,
    identities,
    addressBook,
    network,
    unapprovedTxs,
    nextNonce,
    allCollectibleContracts,
    selectedAddress,
    provider: { chainId },
  } = metamask;
  const { tokenData, txData, tokenProps, nonce } = confirmTransaction;
  const { txParams = {}, id: transactionId, type } = txData;
  const transaction =
    Object.values(unapprovedTxs).find(
      ({ id }) => id === (transactionId || Number(paramsTransactionId)),
    ) || {};
  const {
    from: fromAddress,
    to: txParamsToAddress,
    gasPrice,
    gas: gasLimit,
    value: amount,
    data,
  } = (transaction && transaction.txParams) || txParams;
  const accounts = getMetaMaskAccounts(state);

  const { balance } = accounts[fromAddress];
  const { name: fromName } = identities[fromAddress];
  const toAddress = propsToAddress || txParamsToAddress;

  const tokenList = getTokenList(state);
  const useTokenDetection = getUseTokenDetection(state);
  const casedTokenList = useTokenDetection
    ? tokenList
    : Object.keys(tokenList).reduce((acc, base) => {
        return {
          ...acc,
          [base.toLowerCase()]: tokenList[base],
        };
      }, {});
  const toName =
    identities[toAddress]?.name ||
    casedTokenList[toAddress]?.name ||
    shortenAddress(toChecksumHexAddress(toAddress));

  const checksummedAddress = toChecksumHexAddress(toAddress);
  const addressBookObject =
    addressBook &&
    addressBook[chainId] &&
    addressBook[chainId][checksummedAddress];
  const toEns = ensResolutionsByAddress[checksummedAddress] || '';
  const toNickname = addressBookObject ? addressBookObject.name : '';
  const transactionStatus = transaction ? transaction.status : '';
  const supportsEIP1559 =
    checkNetworkAndAccountSupports1559(state) && !isLegacyTransaction(txParams);

  const {
    hexTransactionAmount,
    hexMinimumTransactionFee,
    hexMaximumTransactionFee,
    hexTransactionTotal,
    gasEstimationObject,
  } = transactionFeeSelector(state, transaction);

  if (transaction && transaction.simulationFails) {
    txData.simulationFails = transaction.simulationFails;
  }

  const currentNetworkUnapprovedTxs = Object.keys(unapprovedTxs)
    .filter((key) =>
      transactionMatchesNetwork(unapprovedTxs[key], chainId, network),
    )
    .reduce((acc, key) => ({ ...acc, [key]: unapprovedTxs[key] }), {});
  const unapprovedTxCount = valuesFor(currentNetworkUnapprovedTxs).length;

  const insufficientBalance = !isBalanceSufficient({
    amount,
    gasTotal: calcGasTotal(gasLimit, gasPrice),
    balance,
    conversionRate,
  });

  const methodData = getKnownMethodData(state, data) || {};

  let fullTxData = { ...txData, ...transaction };
  if (customTxParamsData) {
    fullTxData = {
      ...fullTxData,
      txParams: {
        ...fullTxData.txParams,
        data: customTxParamsData,
      },
    };
  }

  const isCollectibleTransfer = Boolean(
    allCollectibleContracts?.[selectedAddress]?.[chainId].find((contract) => {
      return isEqualCaseInsensitive(contract.address, fullTxData.txParams.to);
    }),
  );

  customNonceValue = getCustomNonceValue(state);
  const isEthGasPrice = getIsEthGasPriceFetched(state);
  const noGasPrice = !supportsEIP1559 && getNoGasPriceFetched(state);
  const { useNativeCurrencyAsPrimaryCurrency } = getPreferences(state);
  const gasFeeIsCustom =
    fullTxData.userFeeLevel === CUSTOM_GAS_ESTIMATE ||
    txParamsAreDappSuggested(fullTxData);
  const fromAddressIsLedger = isAddressLedger(state, fromAddress);
  const nativeCurrency = getNativeCurrency(state);

  const hardwareWalletRequiresConnection = doesAddressRequireLedgerHidConnection(
    state,
    fromAddress,
  );

  const isMultiLayerFeeNetwork = getIsMultiLayerFeeNetwork(state);
  const eip1559V2Enabled = getEIP1559V2Enabled(state);

  return {
    balance,
    fromAddress,
    fromName,
    toAddress,
    toEns,
    toName,
    toNickname,
    hexTransactionAmount,
    hexMinimumTransactionFee,
    hexMaximumTransactionFee,
    hexTransactionTotal,
    txData: fullTxData,
    tokenData,
    methodData,
    tokenProps,
    conversionRate,
    transactionStatus,
    nonce,
    unapprovedTxs,
    unapprovedTxCount,
    currentNetworkUnapprovedTxs,
    customGas: {
      gasLimit,
      gasPrice,
    },
    advancedInlineGasShown: getAdvancedInlineGasShown(state),
    useNonceField: getUseNonceField(state),
    customNonceValue,
    insufficientBalance,
    hideSubtitle: !getShouldShowFiat(state) && !isCollectibleTransfer,
    hideFiatConversion: !getShouldShowFiat(state),
    type,
    nextNonce,
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    isMainnet,
    isEthGasPrice,
    noGasPrice,
    supportsEIP1559,
    gasIsLoading: isGasEstimatesLoading || gasLoadingAnimationIsShowing,
    useNativeCurrencyAsPrimaryCurrency,
    maxFeePerGas: gasEstimationObject.maxFeePerGas,
    maxPriorityFeePerGas: gasEstimationObject.maxPriorityFeePerGas,
    baseFeePerGas: gasEstimationObject.baseFeePerGas,
    gasFeeIsCustom,
    showLedgerSteps: fromAddressIsLedger,
    nativeCurrency,
    hardwareWalletRequiresConnection,
    isMultiLayerFeeNetwork,
    chainId,
    eip1559V2Enabled,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    tryReverseResolveAddress: (address) => {
      return dispatch(tryReverseResolveAddress(address));
    },
    updateCustomNonce: (value) => {
      customNonceValue = value;
      dispatch(updateCustomNonce(value));
    },
    clearConfirmTransaction: () => dispatch(clearConfirmTransaction()),
    showTransactionConfirmedModal: ({ onSubmit }) => {
      return dispatch(showModal({ name: 'TRANSACTION_CONFIRMED', onSubmit }));
    },
    showRejectTransactionsConfirmationModal: ({
      onSubmit,
      unapprovedTxCount,
    }) => {
      return dispatch(
        showModal({ name: 'REJECT_TRANSACTIONS', onSubmit, unapprovedTxCount }),
      );
    },
    cancelTransaction: ({ id }) => dispatch(cancelTx({ id })),
    cancelAllTransactions: (txList) => dispatch(cancelTxs(txList)),
    sendTransaction: (txData) =>
      dispatch(updateAndApproveTx(customNonceMerge(txData))),
    getNextNonce: () => dispatch(getNextNonce()),
    setDefaultHomeActiveTabName: (tabName) =>
      dispatch(setDefaultHomeActiveTabName(tabName)),
    updateTransactionGasFees: (gasFees) => {
      dispatch(updateTransactionGasFees({ ...gasFees, expectHexWei: true }));
    },
    showBuyModal: () => dispatch(showModal({ name: 'DEPOSIT_ETHER' })),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { txData, unapprovedTxs } = stateProps;

  const {
    cancelAllTransactions: dispatchCancelAllTransactions,
    updateTransactionGasFees: dispatchUpdateTransactionGasFees,
    ...otherDispatchProps
  } = dispatchProps;

  return {
    ...stateProps,
    ...otherDispatchProps,
    ...ownProps,
    cancelAllTransactions: () =>
      dispatchCancelAllTransactions(valuesFor(unapprovedTxs)),
    updateGasAndCalculate: ({ gasLimit, gasPrice }) => {
      dispatchUpdateTransactionGasFees({
        gasLimit,
        gasPrice,
        transaction: txData,
      });
    },
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
)(ConfirmTransactionBase);
