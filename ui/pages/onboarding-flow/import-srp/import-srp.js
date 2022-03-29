import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
  TwoStepProgressBar,
  twoStepStages,
} from '../../../components/app/step-progress-bar';
import Box from '../../../components/ui/box';
import Button from '../../../components/ui/button';
import Typography from '../../../components/ui/typography';
import {
  FONT_WEIGHT,
  TEXT_ALIGN,
  TYPOGRAPHY,
} from '../../../helpers/constants/design-system';
import { ONBOARDING_CREATE_PASSWORD_ROUTE } from '../../../helpers/constants/routes';
import { clearClipboard } from '../../../helpers/utils/util';
import { useI18nContext } from '../../../hooks/useI18nContext';
import ZENDESK_URLS from '../../../helpers/constants/zendesk-url';

export default function ImportSRP({ submitSecretRecoveryPhrase }) {
  const [secretRecoveryPhrase, setSecretRecoveryPhrase] = useState('');
  const [revealSRP, setRevealSRP] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const t = useI18nContext();
  const { isValidMnemonic } = ethers.utils;

  const parseSeedPhrase = (seedPhrase) =>
    (seedPhrase || '').trim().toLowerCase().match(/\w+/gu)?.join(' ') || '';

  const handleSecretRecoveryPhraseChange = (recoveryPhrase) => {
    setError('');
    if (recoveryPhrase) {
      const parsedSecretRecoveryPhrase = parseSeedPhrase(recoveryPhrase);
      const wordCount = parsedSecretRecoveryPhrase.split(/\s/u).length;
      if (wordCount % 3 !== 0 || wordCount > 24 || wordCount < 12) {
        setError(t('seedPhraseReq'));
      } else if (!isValidMnemonic(parsedSecretRecoveryPhrase)) {
        setError(t('invalidSeedPhrase'));
      }
    }
    setSecretRecoveryPhrase(recoveryPhrase);
  };

  return (
    <div className="import-srp">
      <TwoStepProgressBar stage={twoStepStages.RECOVERY_PHRASE_CONFIRM} />
      <div className="import-srp__header">
        <Typography variant={TYPOGRAPHY.H2} fontWeight={FONT_WEIGHT.BOLD}>
          {t('importExistingWalletTitle')}
        </Typography>
        <Typography variant={TYPOGRAPHY.H4}>
          {t('importExistingWalletDescription', [
            <a
              key="learnMore"
              type="link"
              href={ZENDESK_URLS.SECRET_RECOVERY_PHRASE}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('learnMoreUpperCase')}
            </a>,
          ])}
        </Typography>
      </div>
      <div className="import-srp__actions">
        <Box textAlign={TEXT_ALIGN.LEFT}>
          <Typography variant={TYPOGRAPHY.H4}>
            {t('secretRecoveryPhrase')}
          </Typography>

          <div className="srp-text-area">
            <button onClick={() => setRevealSRP(!revealSRP)}>
              <i
                className={`far fa-eye${revealSRP ? '-slash' : ''}`}
                style={{ color: 'var(--color-icon-default' }}
              />
            </button>
            <textarea
              data-testid="import-srp-text"
              className={classnames('srp-text-area__textarea', {
                'srp-text-area__textarea--blur': !revealSRP,
                'srp-text-area__textarea--error': error,
              })}
              onChange={({ target: { value } }) =>
                handleSecretRecoveryPhraseChange(value)
              }
              onPaste={clearClipboard}
              autoComplete="off"
              autoCorrect="off"
            />
            {error && (
              <span className="srp-text-area__textarea__error-message">
                {error}
              </span>
            )}
          </div>
          <Button
            type="primary"
            data-testid="import-srp-confirm"
            large
            onClick={() => {
              submitSecretRecoveryPhrase(secretRecoveryPhrase);
              history.replace(ONBOARDING_CREATE_PASSWORD_ROUTE);
            }}
            disabled={error || secretRecoveryPhrase.length === 0}
          >
            {t('confirmRecoveryPhrase')}
          </Button>
        </Box>
      </div>
    </div>
  );
}

ImportSRP.propTypes = {
  submitSecretRecoveryPhrase: PropTypes.func,
};
