import React from 'react';

import {
  COLORS,
  FONT_WEIGHT,
  TYPOGRAPHY,
} from '../../../../helpers/constants/design-system';
import { roundToDecimalPlacesRemovingExtraZeroes } from '../../../../helpers/utils/util';
import { useGasFeeContext } from '../../../../contexts/gasFee';
import I18nValue from '../../../ui/i18n-value';
import Typography from '../../../ui/typography/typography';

import { BaseFeeTooltip } from './tooltips';
import LatestPriorityFeeField from './latest-priority-fee-field';
import StatusSlider from './status-slider';

const NetworkStatistics = () => {
  const { gasFeeEstimates } = useGasFeeContext();

  return (
    <div className="network-statistics">
      <Typography
        color={COLORS.TEXT_ALTERNATIVE}
        fontWeight={FONT_WEIGHT.BOLD}
        margin={[3, 0]}
        variant={TYPOGRAPHY.H8}
      >
        <I18nValue messageKey="networkStatus" />
      </Typography>
      <div className="network-statistics__info">
        <div className="network-statistics__info__field">
          <BaseFeeTooltip>
            <span className="network-statistics__info__field-data">
              {gasFeeEstimates?.estimatedBaseFee &&
                `${roundToDecimalPlacesRemovingExtraZeroes(
                  gasFeeEstimates?.estimatedBaseFee,
                  0,
                )} GWEI`}
            </span>
            <span className="network-statistics__info__field-label">
              <I18nValue messageKey="baseFee" />
            </span>
          </BaseFeeTooltip>
        </div>
        <div className="network-statistics__info__separator" />
        <LatestPriorityFeeField />
        <div className="network-statistics__info__separator" />
        <div className="network-statistics__info__field">
          <StatusSlider />
        </div>
      </div>
    </div>
  );
};

export default NetworkStatistics;
