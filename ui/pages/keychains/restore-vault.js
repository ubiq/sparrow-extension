import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  createNewVaultAndRestore,
  unMarkPasswordForgotten,
  initializeThreeBox,
} from '../../store/actions';
import { DEFAULT_ROUTE } from '../../helpers/constants/routes';
import CreateNewVault from '../../components/app/create-new-vault';
import Button from '../../components/ui/button';
import Box from '../../components/ui/box';
import Typography from '../../components/ui/typography';
import ZENDESK_URLS from '../../helpers/constants/zendesk-url';
import { TYPOGRAPHY, COLORS } from '../../helpers/constants/design-system';

class RestoreVaultPage extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  static propTypes = {
    createNewVaultAndRestore: PropTypes.func.isRequired,
    leaveImportSeedScreenState: PropTypes.func,
    history: PropTypes.object,
    isLoading: PropTypes.bool,
    initializeThreeBox: PropTypes.func,
  };

  handleImport = async (password, seedPhrase) => {
    const {
      // eslint-disable-next-line no-shadow
      createNewVaultAndRestore,
      leaveImportSeedScreenState,
      history,
      // eslint-disable-next-line no-shadow
      initializeThreeBox,
    } = this.props;

    leaveImportSeedScreenState();
    await createNewVaultAndRestore(password, seedPhrase);
    initializeThreeBox();
    history.push(DEFAULT_ROUTE);
  };

  render() {
    const { t } = this.context;
    const { isLoading } = this.props;

    return (
      <Box className="first-view-main-wrapper">
        <Box className="first-view-main">
          <Box className="import-account">
            <a
              className="import-account__back-button"
              onClick={(e) => {
                e.preventDefault();
                this.props.leaveImportSeedScreenState();
                this.props.history.goBack();
              }}
              href="#"
            >
              {`< ${t('back')}`}
            </a>
            <Typography variant={TYPOGRAPHY.H1} color={COLORS.BLACK}>
              {t('resetWallet')}
            </Typography>
            <Typography color={COLORS.BLACK}>
              {t('resetWalletSubHeader')}
            </Typography>
            <Typography color={COLORS.BLACK} margin={[4, 0]}>
              {t('resetWalletUsingSRP', [
                <Button
                  type="link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={ZENDESK_URLS.ADD_MISSING_ACCOUNTS}
                  key="import-account-secretphase"
                  className="import-account__link"
                >
                  {t('reAddAccounts')}
                </Button>,
                <Button
                  type="link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={ZENDESK_URLS.IMPORT_ACCOUNTS}
                  key="import-account-reimport-accounts"
                  className="import-account__link"
                >
                  {t('reAdded')}
                </Button>,
                <Button
                  type="link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={ZENDESK_URLS.ADD_CUSTOM_TOKENS}
                  key="import-account-readd-tokens"
                  className="import-account__link"
                >
                  {t('reAdded')}
                </Button>,
              ])}
            </Typography>
            <Typography color={COLORS.BLACK} margin={[0, 0, 4]}>
              {t('resetWalletWarning')}
            </Typography>
            <CreateNewVault
              disabled={isLoading}
              onSubmit={this.handleImport}
              submitText={t('restore')}
            />
          </Box>
        </Box>
      </Box>
    );
  }
}

export default connect(
  ({ appState: { isLoading } }) => ({ isLoading }),
  (dispatch) => ({
    leaveImportSeedScreenState: () => {
      dispatch(unMarkPasswordForgotten());
    },
    createNewVaultAndRestore: (pw, seed) =>
      dispatch(createNewVaultAndRestore(pw, seed)),
    initializeThreeBox: () => dispatch(initializeThreeBox()),
  }),
)(RestoreVaultPage);
