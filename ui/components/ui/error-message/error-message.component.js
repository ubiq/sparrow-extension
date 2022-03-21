import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = (props, context) => {
  const { errorMessage, errorKey } = props;
  const error = errorKey ? context.t(errorKey) : errorMessage;

  return (
    <div className="error-message">
      <i className="fa fa-exclamation-circle error-message__icon" />
      <div className="error-message__text">{error}</div>
    </div>
  );
};

ErrorMessage.propTypes = {
  /**
   * The text content for the error message
   */
  errorMessage: PropTypes.string,
  /**
   * The translate key for localization. Uses context.t(). Will override the error message
   */
  errorKey: PropTypes.string,
};

ErrorMessage.contextTypes = {
  t: PropTypes.func,
};

export default ErrorMessage;
