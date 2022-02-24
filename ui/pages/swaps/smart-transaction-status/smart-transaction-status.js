import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { I18nContext } from '../../../contexts/i18n';
import { useNewMetricEvent } from '../../../hooks/useMetricEvent';
import {
  getFetchParams,
  prepareToLeaveSwaps,
  getCurrentSmartTransactions,
  getSelectedQuote,
  getTopQuote,
  getSmartTransactionsOptInStatus,
  getSmartTransactionsEnabled,
  getCurrentSmartTransactionsEnabled,
  getSwapsRefreshStates,
  cancelSwapsSmartTransaction,
} from '../../../ducks/swaps/swaps';
import {
  isHardwareWallet,
  getHardwareWalletType,
} from '../../../selectors/selectors';
import {
  DEFAULT_ROUTE,
  BUILD_QUOTE_ROUTE,
} from '../../../helpers/constants/routes';
import Typography from '../../../components/ui/typography';
import Box from '../../../components/ui/box';
import UrlIcon from '../../../components/ui/url-icon';
import {
  BLOCK_SIZES,
  COLORS,
  TYPOGRAPHY,
  JUSTIFY_CONTENT,
  DISPLAY,
  FONT_WEIGHT,
  ALIGN_ITEMS,
} from '../../../helpers/constants/design-system';
import {
  stopPollingForQuotes,
  setBackgroundSwapRouteState,
} from '../../../store/actions';
import { SMART_TRANSACTION_STATUSES } from '../../../../shared/constants/transaction';

import SwapsFooter from '../swaps-footer';
import { calcTokenAmount } from '../../../helpers/utils/token-util';
import { showRemainingTimeInMinAndSec } from '../swaps.util';
import SuccessIcon from './success-icon';
import RevertedIcon from './reverted-icon';
import CanceledIcon from './canceled-icon';
import UnknownIcon from './unknown-icon';
import ArrowIcon from './arrow-icon';
import TimerIcon from './timer-icon';

export default function SmartTransactionStatus() {
  const [cancelSwapLinkClicked, setCancelSwapLinkClicked] = useState(false);
  const t = useContext(I18nContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const fetchParams = useSelector(getFetchParams) || {};
  const { destinationTokenInfo = {}, sourceTokenInfo = {} } =
    fetchParams?.metaData || {};
  const hardwareWalletUsed = useSelector(isHardwareWallet);
  const hardwareWalletType = useSelector(getHardwareWalletType);
  const needsTwoConfirmations = true;
  const selectedQuote = useSelector(getSelectedQuote);
  const topQuote = useSelector(getTopQuote);
  const usedQuote = selectedQuote || topQuote;
  const currentSmartTransactions = useSelector(getCurrentSmartTransactions);
  const smartTransactionsOptInStatus = useSelector(
    getSmartTransactionsOptInStatus,
  );
  const swapsRefreshRates = useSelector(getSwapsRefreshStates);
  const smartTransactionsEnabled = useSelector(getSmartTransactionsEnabled);
  const currentSmartTransactionsEnabled = useSelector(
    getCurrentSmartTransactionsEnabled,
  );
  let smartTransactionStatus = SMART_TRANSACTION_STATUSES.PENDING;
  let latestSmartTransaction = {};
  let latestSmartTransactionUuid;

  if (currentSmartTransactions && currentSmartTransactions.length > 0) {
    latestSmartTransaction =
      currentSmartTransactions[currentSmartTransactions.length - 1];
    latestSmartTransactionUuid = latestSmartTransaction?.uuid;
    smartTransactionStatus =
      latestSmartTransaction?.status || SMART_TRANSACTION_STATUSES.PENDING;
  }

  const [timeLeftForPendingStxInSec, setTimeLeftForPendingStxInSec] = useState(
    swapsRefreshRates.stxStatusDeadline,
  );

  const sensitiveProperties = {
    needs_two_confirmations: needsTwoConfirmations,
    token_from: sourceTokenInfo?.symbol,
    token_from_amount: fetchParams?.value,
    token_to: destinationTokenInfo?.symbol,
    request_type: fetchParams?.balanceError ? 'Quote' : 'Order',
    slippage: fetchParams?.slippage,
    custom_slippage: fetchParams?.slippage === 2,
    is_hardware_wallet: hardwareWalletUsed,
    hardware_wallet_type: hardwareWalletType,
    stx_uuid: latestSmartTransactionUuid,
    stx_enabled: smartTransactionsEnabled,
    current_stx_enabled: currentSmartTransactionsEnabled,
    stx_user_opt_in: smartTransactionsOptInStatus,
  };

  let destinationValue;
  if (usedQuote?.destinationAmount) {
    destinationValue = calcTokenAmount(
      usedQuote?.destinationAmount,
      destinationTokenInfo.decimals,
    ).toPrecision(8);
  }

  const stxStatusPageLoadedEvent = useNewMetricEvent({
    event: 'STX Status Page Loaded',
    category: 'swaps',
    sensitiveProperties,
  });

  const cancelSmartTransactionEvent = useNewMetricEvent({
    event: 'Cancel STX',
    category: 'swaps',
    sensitiveProperties,
  });

  const isSmartTransactionPending =
    smartTransactionStatus === SMART_TRANSACTION_STATUSES.PENDING;
  const showCloseButtonOnly =
    isSmartTransactionPending ||
    smartTransactionStatus === SMART_TRANSACTION_STATUSES.SUCCESS;

  useEffect(() => {
    stxStatusPageLoadedEvent();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let intervalId;
    if (isSmartTransactionPending && latestSmartTransactionUuid) {
      const calculateRemainingTime = () => {
        const secondsAfterStxSubmission = Math.round(
          (Date.now() - latestSmartTransaction.time) / 1000,
        );
        if (secondsAfterStxSubmission > swapsRefreshRates.stxStatusDeadline) {
          setTimeLeftForPendingStxInSec(0);
          clearInterval(intervalId);
          return;
        }
        setTimeLeftForPendingStxInSec(
          swapsRefreshRates.stxStatusDeadline - secondsAfterStxSubmission,
        );
      };
      intervalId = setInterval(calculateRemainingTime, 1000);
      calculateRemainingTime();
    }

    return () => clearInterval(intervalId);
  }, [
    dispatch,
    isSmartTransactionPending,
    latestSmartTransactionUuid,
    latestSmartTransaction.time,
    swapsRefreshRates.stxStatusDeadline,
  ]);

  useEffect(() => {
    dispatch(setBackgroundSwapRouteState('smartTransactionStatus'));
    setTimeout(() => {
      // We don't need to poll for quotes on the status page.
      dispatch(stopPollingForQuotes());
    }, 1000); // Stop polling for quotes after 1s.
  }, [dispatch]);

  let headerText = t('stxPendingOptimizingGas');
  let description;
  let subDescription;
  let icon;
  if (isSmartTransactionPending) {
    if (timeLeftForPendingStxInSec < 120) {
      headerText = t('stxPendingFinalizing');
    } else if (timeLeftForPendingStxInSec < 150) {
      headerText = t('stxPendingPrivatelySubmitting');
    }
  }
  if (smartTransactionStatus === SMART_TRANSACTION_STATUSES.SUCCESS) {
    headerText = t('stxSuccess');
    if (destinationTokenInfo?.symbol) {
      description = t('stxSuccessDescription', [destinationTokenInfo.symbol]);
    }
    icon = <SuccessIcon />;
  } else if (smartTransactionStatus === 'cancelled_user_cancelled') {
    headerText = t('stxUserCancelled');
    description = t('stxUserCancelledDescription');
    icon = <CanceledIcon />;
  } else if (
    smartTransactionStatus.startsWith('cancelled') ||
    smartTransactionStatus.includes('deadline_missed')
  ) {
    headerText = t('stxCancelled');
    description = t('stxCancelledDescription');
    subDescription = t('stxCancelledSubDescription');
    icon = <CanceledIcon />;
  } else if (smartTransactionStatus === 'unknown') {
    headerText = t('stxUnknown');
    description = t('stxUnknownDescription');
    icon = <UnknownIcon />;
  } else if (smartTransactionStatus === 'reverted') {
    headerText = t('stxFailure');
    description = t('stxFailureDescription', [
      <a
        className="smart-transaction-status__support-link"
        key="smart-transaction-status-support-link"
        href="https://support.metamask.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('customerSupport')}
      </a>,
    ]);
    icon = <RevertedIcon />;
  }

  const showCancelSwapLink =
    latestSmartTransaction.cancellable && !cancelSwapLinkClicked;

  const CancelSwap = () => {
    return (
      <Box marginBottom={0}>
        <a
          className="smart-transaction-status__cancel-swap-link"
          href="#"
          onClick={(e) => {
            e?.preventDefault();
            setCancelSwapLinkClicked(true); // We want to hide it after a user clicks on it.
            cancelSmartTransactionEvent();
            dispatch(cancelSwapsSmartTransaction(latestSmartTransactionUuid));
          }}
        >
          {t('cancelSwap')}
        </a>
      </Box>
    );
  };

  return (
    <div className="smart-transaction-status">
      <Box
        paddingLeft={8}
        paddingRight={8}
        height={BLOCK_SIZES.FULL}
        justifyContent={JUSTIFY_CONTENT.START}
        display={DISPLAY.FLEX}
        className="smart-transaction-status__content"
      >
        <Box
          marginTop={10}
          marginBottom={0}
          display={DISPLAY.FLEX}
          justifyContent={JUSTIFY_CONTENT.CENTER}
          alignItems={ALIGN_ITEMS.CENTER}
        >
          <Typography color={COLORS.UI4} variant={TYPOGRAPHY.H6}>
            {`${fetchParams?.value && Number(fetchParams.value).toFixed(5)} `}
          </Typography>
          <Typography
            color={COLORS.UI4}
            variant={TYPOGRAPHY.H6}
            fontWeight={FONT_WEIGHT.BOLD}
            boxProps={{ marginLeft: 1, marginRight: 2 }}
          >
            {sourceTokenInfo?.symbol}
          </Typography>
          <UrlIcon
            url={sourceTokenInfo.iconUrl}
            className="main-quote-summary__icon"
            name={sourceTokenInfo.symbol}
            fallbackClassName="main-quote-summary__icon-fallback"
          />
          <Box display={DISPLAY.BLOCK} marginLeft={2} marginRight={2}>
            <ArrowIcon />
          </Box>
          <UrlIcon
            url={destinationTokenInfo.iconUrl}
            className="main-quote-summary__icon"
            name={destinationTokenInfo.symbol}
            fallbackClassName="main-quote-summary__icon-fallback"
          />
          <Typography
            color={COLORS.UI4}
            variant={TYPOGRAPHY.H6}
            boxProps={{ marginLeft: 2 }}
          >
            {`~${destinationValue && Number(destinationValue).toFixed(5)} `}
          </Typography>
          <Typography
            color={COLORS.UI4}
            variant={TYPOGRAPHY.H6}
            fontWeight={FONT_WEIGHT.BOLD}
            boxProps={{ marginLeft: 1 }}
          >
            {destinationTokenInfo?.symbol}
          </Typography>
        </Box>
        <Box
          marginTop={3}
          className="smart-transaction-status__background-animation smart-transaction-status__background-animation--top"
        ></Box>
        {icon && (
          <Box marginTop={3} marginBottom={2}>
            {icon}
          </Box>
        )}
        {isSmartTransactionPending && (
          <Box
            marginTop={7}
            marginBottom={1}
            display={DISPLAY.FLEX}
            justifyContent={JUSTIFY_CONTENT.CENTER}
            alignItems={ALIGN_ITEMS.CENTER}
          >
            <TimerIcon />
            <Typography
              color={COLORS.UI4}
              variant={TYPOGRAPHY.H6}
              boxProps={{ marginLeft: 1 }}
            >
              {`${t('swapCompleteIn')} `}
            </Typography>
            <Typography
              color={COLORS.UI4}
              variant={TYPOGRAPHY.H6}
              fontWeight={FONT_WEIGHT.BOLD}
              boxProps={{ marginLeft: 1 }}
              className="smart-transaction-status__remaining-time"
            >
              {showRemainingTimeInMinAndSec(timeLeftForPendingStxInSec)}
            </Typography>
          </Box>
        )}
        <Typography
          color={COLORS.BLACK}
          variant={TYPOGRAPHY.H4}
          fontWeight={FONT_WEIGHT.BOLD}
        >
          {headerText}
        </Typography>
        {isSmartTransactionPending && (
          <div className="smart-transaction-status__loading-bar-container">
            <div
              className="smart-transaction-status__loading-bar"
              style={{
                width: `${
                  (100 / swapsRefreshRates.stxStatusDeadline) *
                  (swapsRefreshRates.stxStatusDeadline -
                    timeLeftForPendingStxInSec)
                }%`,
              }}
            />
          </div>
        )}
        {description && (
          <Typography
            variant={TYPOGRAPHY.H6}
            boxProps={{ marginTop: 0 }}
            color={COLORS.UI4}
          >
            {description}
          </Typography>
        )}
        <Box
          marginTop={3}
          className="smart-transaction-status__background-animation smart-transaction-status__background-animation--bottom"
        ></Box>
        {subDescription && (
          <Typography
            variant={TYPOGRAPHY.H7}
            boxProps={{ marginTop: 8 }}
            color={COLORS.UI4}
          >
            {subDescription}
          </Typography>
        )}
      </Box>
      {showCancelSwapLink &&
        latestSmartTransactionUuid &&
        isSmartTransactionPending && <CancelSwap />}
      <SwapsFooter
        onSubmit={async () => {
          if (showCloseButtonOnly) {
            await dispatch(prepareToLeaveSwaps());
            history.push(DEFAULT_ROUTE);
          } else {
            history.push(BUILD_QUOTE_ROUTE);
          }
        }}
        onCancel={async () => {
          await dispatch(prepareToLeaveSwaps());
          history.push(DEFAULT_ROUTE);
        }}
        submitText={showCloseButtonOnly ? t('close') : t('tryAgain')}
        hideCancel={showCloseButtonOnly}
        cancelText={t('close')}
        className="smart-transaction-status__swaps-footer"
      />
    </div>
  );
}
