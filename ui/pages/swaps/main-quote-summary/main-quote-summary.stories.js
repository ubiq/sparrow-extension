import React from 'react';
import { text, number } from '@storybook/addon-knobs';
import MainQuoteSummary from './main-quote-summary';

export default {
  title: 'Pages/Swaps/MainQuoteSummary',
  id: __filename,
};

export const DefaultStory = () => {
  return (
    <div
      style={{
        width: '360px',
        height: '224px',
        border: '1px solid black',
        padding: '24px',
      }}
    >
      <MainQuoteSummary
        sourceValue={text('sourceValue', '2000000000000000000')}
        sourceDecimals={number('sourceDecimals', 18)}
        sourceSymbol={text('sourceSymbol', 'UBQ')}
        destinationValue={text('destinationValue', '200000000000000000')}
        destinationDecimals={number('destinationDecimals', 18)}
        destinationSymbol={text('destinationSymbol', 'ABC')}
        sourceIconUrl=".storybook/images/metamark.svg"
        destinationIconUrl=".storybook/images/sai.svg"
      />
    </div>
  );
};

DefaultStory.storyName = 'Default';
