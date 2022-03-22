import React from 'react';

import { PRIORITY_LEVELS } from '../../../../../shared/constants/gas';
import { decGWEIToHexWEI } from '../../../../../shared/modules/conversion.utils';
import { useTransactionModalContext } from '../../../../contexts/transaction-modal';
import { useGasFeeContext } from '../../../../contexts/gasFee';
import Button from '../../../ui/button';
import I18nValue from '../../../ui/i18n-value';

import { useAdvancedGasFeePopoverContext } from '../context';

const AdvancedGasFeeSaveButton = () => {
  const { closeModal } = useTransactionModalContext();
  const { updateTransaction } = useGasFeeContext();
  const {
    gasLimit,
    hasErrors,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = useAdvancedGasFeePopoverContext();

  const onSave = () => {
    updateTransaction({
      estimateUsed: PRIORITY_LEVELS.CUSTOM,
      maxFeePerGas: decGWEIToHexWEI(maxFeePerGas),
      maxPriorityFeePerGas: decGWEIToHexWEI(maxPriorityFeePerGas),
      gasLimit,
    });
    closeModal(['advancedGasFee', 'editGasFee']);
  };

  return (
    <Button type="primary" disabled={hasErrors} onClick={onSave}>
      <I18nValue messageKey="save" />
    </Button>
  );
};

export default AdvancedGasFeeSaveButton;
