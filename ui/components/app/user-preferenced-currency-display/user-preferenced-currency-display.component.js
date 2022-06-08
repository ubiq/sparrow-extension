import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { PRIMARY, SECONDARY, ETH } from '../../../helpers/constants/common';
import CurrencyDisplay from '../../ui/currency-display';
import { useUserPreferencedCurrency } from '../../../hooks/useUserPreferencedCurrency';

export default function UserPreferencedCurrencyDisplay({
  'data-testid': dataTestId,
  ethLogoHeight = 24,
  ethNumberOfDecimals,
  fiatNumberOfDecimals,
  numberOfDecimals: propsNumberOfDecimals,
  showEthLogo,
  type,
  showFiat,
  ...restProps
}) {
  const { currency, numberOfDecimals } = useUserPreferencedCurrency(type, {
    ethNumberOfDecimals,
    fiatNumberOfDecimals,
    numberOfDecimals: propsNumberOfDecimals,
    showFiatOverride: showFiat,
  });
  const prefixComponent = useMemo(() => {
    return (
      currency === ETH &&
      showEthLogo && (
        <img src="./images/eth.svg" height={ethLogoHeight} style={{height: "24px", marginTop: "8px"}} alt="" />
      )
    );
  }, [currency, showEthLogo, ethLogoHeight]);

  return (
    <CurrencyDisplay
      {...restProps}
      currency={currency}
      data-testid={dataTestId}
      numberOfDecimals={numberOfDecimals}
      prefixComponent={prefixComponent}
    />
  );
}

UserPreferencedCurrencyDisplay.propTypes = {
  className: PropTypes.string,
  'data-testid': PropTypes.string,
  prefix: PropTypes.string,
  value: PropTypes.string,
  numberOfDecimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hideLabel: PropTypes.bool,
  hideTitle: PropTypes.bool,
  style: PropTypes.object,
  showEthLogo: PropTypes.bool,
  ethLogoHeight: PropTypes.number,
  type: PropTypes.oneOf([PRIMARY, SECONDARY]),
  ethNumberOfDecimals: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  fiatNumberOfDecimals: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  showFiat: PropTypes.boolean,
};
