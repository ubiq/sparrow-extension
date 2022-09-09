import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useI18nContext } from '../../../hooks/useI18nContext';
import TextField from '../../ui/text-field';
import Button from '../../ui/button';
import SrpInput from '../srp-input';

export default function CreateNewVault({
  disabled = false,
  onSubmit,
  submitText,
}) {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');

  const t = useI18nContext();

  const onPasswordChange = useCallback(
    (newPassword) => {
      let newConfirmPasswordError = '';
      let newPasswordError = '';

      if (newPassword && newPassword.length < 8) {
        newPasswordError = t('passwordNotLongEnough');
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        newConfirmPasswordError = t('passwordsDontMatch');
      }

      setPassword(newPassword);
      setPasswordError(newPasswordError);
      setConfirmPasswordError(newConfirmPasswordError);
    },
    [confirmPassword, t],
  );

  const onConfirmPasswordChange = useCallback(
    (newConfirmPassword) => {
      let newConfirmPasswordError = '';

      if (password !== newConfirmPassword) {
        newConfirmPasswordError = t('passwordsDontMatch');
      }

      setConfirmPassword(newConfirmPassword);
      setConfirmPasswordError(newConfirmPasswordError);
    },
    [password, t],
  );

  const isValid =
    !disabled &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    seedPhrase &&
    !passwordError &&
    !confirmPasswordError;

  const onImport = useCallback(
    async (event) => {
      event.preventDefault();

      if (!isValid) {
        return;
      }

      await onSubmit(password, seedPhrase);
    },
    [isValid, onSubmit, password, seedPhrase],
  );

  return (
    <form className="create-new-vault__form" onSubmit={onImport}>
      <SrpInput onChange={setSeedPhrase} srpText={t('secretRecoveryPhrase')} />
      <div className="create-new-vault__create-password">
        <TextField
          id="password"
          label={t('newPassword')}
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          error={passwordError}
          autoComplete="new-password"
          margin="normal"
          largeLabel
        />
        <TextField
          id="confirm-password"
          label={t('confirmPassword')}
          type="password"
          value={confirmPassword}
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
          error={confirmPasswordError}
          autoComplete="new-password"
          margin="normal"
          largeLabel
        />
      </div>
      <Button
        className="create-new-vault__submit-button"
        type="primary"
        submit
        disabled={!isValid}
      >
        {submitText}
      </Button>
    </form>
  );
}

CreateNewVault.propTypes = {
  disabled: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
};
