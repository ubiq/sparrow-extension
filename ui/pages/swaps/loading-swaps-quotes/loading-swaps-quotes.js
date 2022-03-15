import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { shuffle } from 'lodash';
import { useHistory } from 'react-router-dom';
import { navigateBackToBuildQuote } from '../../../ducks/swaps/swaps';
import { I18nContext } from '../../../contexts/i18n';
import SwapsFooter from '../swaps-footer';
import BackgroundAnimation from './background-animation';

export default function LoadingSwapsQuotes({
  aggregatorMetadata,
  loadingComplete,
  onDone,
}) {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();
  const history = useHistory();

  const [aggregatorNames] = useState(() =>
    shuffle(Object.keys(aggregatorMetadata)),
  );
  const numberOfQuotes = aggregatorNames.length;
  const mascotContainer = useRef();

  const [quoteCount, updateQuoteCount] = useState(0);

  useEffect(() => {
    let timeoutLength;

    // The below logic simulates a sequential loading of the aggregator quotes, even though we are fetching them all with a single call.
    // This is to give the user a sense of progress. The callback passed to `setTimeout` updates the quoteCount and therefore causes
    // a new logo to be shown, the fox to look at that logo, the logo bar and aggregator name to update.

    if (loadingComplete) {
      // If loading is complete, but the quoteCount is not, we quickly display the remaining logos/names/fox looks. 0.2s each
      timeoutLength = 20;
    } else {
      // If loading is not complete, we display remaining logos/names/fox looks at random intervals between 0.5s and 2s, to simulate the
      // sort of loading a user would experience in most async scenarios
      timeoutLength = 500 + Math.floor(Math.random() * 1500);
    }
    const quoteCountTimeout = setTimeout(() => {
      if (quoteCount < numberOfQuotes) {
        updateQuoteCount(quoteCount + 1);
      } else if (quoteCount === numberOfQuotes && loadingComplete) {
        onDone();
      }
    }, timeoutLength);

    return function cleanup() {
      clearTimeout(quoteCountTimeout);
    };
  }, [quoteCount, loadingComplete, onDone, numberOfQuotes]);

  return (
    <div className="loading-swaps-quotes">
      <div className="loading-swaps-quotes__content">
        <>
          <div className="loading-swaps-quotes__quote-counter">
            <span>
              {t('swapFetchingQuoteNofN', [
                Math.min(quoteCount + 1, numberOfQuotes),
                numberOfQuotes,
              ])}
            </span>
          </div>
          <div className="loading-swaps-quotes__quote-name-check">
            <span>{t('swapFetchingQuotes')}</span>
          </div>
          <div className="loading-swaps-quotes__loading-bar-container">
            <div
              className="loading-swaps-quotes__loading-bar"
              style={{
                width: `${(100 / numberOfQuotes) * quoteCount}%`,
              }}
            />
          </div>
        </>
        <div className="loading-swaps-quotes__animation">
          <BackgroundAnimation />
          <div
            className="loading-swaps-quotes__mascot-container"
            ref={mascotContainer}
          >
            <img src="images/icon-128.png" />
          </div>
        </div>
      </div>
      <SwapsFooter
        submitText={t('back')}
        onSubmit={async () => {
          await dispatch(navigateBackToBuildQuote(history));
        }}
        hideCancel
      />
    </div>
  );
}

LoadingSwapsQuotes.propTypes = {
  loadingComplete: PropTypes.bool.isRequired,
  onDone: PropTypes.func.isRequired,
  aggregatorMetadata: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.string,
      color: PropTypes.string,
      icon: PropTypes.string,
    }),
  ),
};
