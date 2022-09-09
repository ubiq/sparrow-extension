import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { IMPORT_TOKEN_ROUTE } from '../../../helpers/constants/routes';
import Button from '../../ui/button';
import Box from '../../ui/box/box';
import { TEXT_ALIGN } from '../../../helpers/constants/design-system';
import { detectNewTokens } from '../../../store/actions';
import { getIsMainnet, getIsTokenDetectionSupported } from '../../../selectors';

export default function ImportTokenLink() {
  const t = useI18nContext();
  const history = useHistory();

  const isMainnet = useSelector(getIsMainnet);
  const isTokenDetectionSupported = useSelector(getIsTokenDetectionSupported);

  const isTokenDetectionsupported =
    isMainnet ||
    (process.env.TOKEN_DETECTION_V2 && isTokenDetectionSupported) ||
    Boolean(process.env.IN_TEST);

  return (
    <Box className="import-token-link" textAlign={TEXT_ALIGN.CENTER}>
      {isTokenDetectionsupported && (
        <>
          <Button
            className="import-token-link__link"
            type="link"
            onClick={() => detectNewTokens()}
          >
            {t('refreshList')}
          </Button>
          {t('or')}
        </>
      )}
      <Button
        className="import-token-link__link"
        type="link"
        onClick={() => {
          history.push(IMPORT_TOKEN_ROUTE);
        }}
      >
        {isTokenDetectionsupported
          ? t('importTokens')
          : t('importTokens').charAt(0).toUpperCase() +
            t('importTokens').slice(1)}
      </Button>
    </Box>
  );
}
