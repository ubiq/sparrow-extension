import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/ui/button';

export default class NewAccountCreateForm extends Component {
  static defaultProps = {
    newAccountNumber: 0,
  };

  state = {
    newAccountName: '',
    usePersona: true,
    defaultAccountName: this.context.t('newAccountNumberName', [
      this.props.newAccountNumber,
    ]),
  };

  render() {

    const { defaultAccountName, newAccountName } = this.state;
    
    const {
      history,
      createAccount,
      mostRecentOverviewPage,
      accounts,
    } = this.props;

    const createClick = (_) => {
      createAccount(newAccountName || defaultAccountName).then(() => {
        history.push(mostRecentOverviewPage);
      });
    };

    const accountNameExists = (allAccounts, accountName) => {
      const accountsNames = allAccounts.map((item) => item.name);

      return accountsNames.includes(accountName);
    };

    const existingAccountName = accountNameExists(accounts, newAccountName);

    return (
      <>
        <div className="page-container__header">
          <div className="page-container__title">{this.context.t('createAccount')}</div>
          <div className="page-container__subtitle">
            {this.context.t('createAccountMsg')}
            <span
              className="new-account-info-link"
              onClick={() => {
                global.platform.openTab({
                  url:
                    'https://blog.ubiqsmart.com/introducing-persona-a-new-way-to-web3-b44ffc2d6f66',
                });
              }}
            >
              {this.context.t('here')}
            </span>
          </div>
        </div>
        <div className="new-account-create-form">
          {/* <div className="new-account-create-form__input-label">
            {this.context.t('accountName')}
          </div> */}
          <div>
            {/* <input
              className={classnames('new-account-create-form__input', {
                'new-account-create-form__input__error': existingAccountName,
              })}
              value={newAccountName}
              placeholder={defaultAccountName}
              onChange={(event) =>
                this.setState({ newAccountName: event.target.value })
              }
              autoFocus
            />
            {existingAccountName ? (
              <div
                className={classnames(
                  ' new-account-create-form__error',
                  ' new-account-create-form__error-amount',
                )}
              >
                {this.context.t('accountNameDuplicate')}
              </div>
            ) : null} */}
            <div className="new-account-create-form__buttons">
              <Button
                type="secondary"
                large
                className="new-account-create-form__button"
                onClick={() => history.push(mostRecentOverviewPage)}
              >
                {this.context.t('cancel')}
              </Button>
              <Button
                type="primary"
                large
                className="new-account-create-form__button"
                onClick={createClick}
                disabled={existingAccountName}
              >
                {this.context.t('create')}
              </Button>
            </div>
          </div>
        </div>
        </>
    );
  }
}

NewAccountCreateForm.propTypes = {
  createAccount: PropTypes.func,
  newAccountNumber: PropTypes.number,
  history: PropTypes.object,
  mostRecentOverviewPage: PropTypes.string.isRequired,
  accounts: PropTypes.array,
};

NewAccountCreateForm.contextTypes = {
  t: PropTypes.func,
  trackEvent: PropTypes.func,
};
