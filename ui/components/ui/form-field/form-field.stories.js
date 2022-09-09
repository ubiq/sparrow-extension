/* eslint-disable react/prop-types */

import React, { useState } from 'react';
import README from './README.mdx';
import FormField from '.';

export default {
  title: 'Components/UI/FormField',
  id: __filename,
  component: FormField,
  parameters: {
    docs: {
      page: README,
    },
  },
  argTypes: {
    titleText: { control: 'text' },
    titleUnit: { control: 'text' },
    tooltipText: { control: 'text' },
    titleDetail: {
      options: ['text', 'button', 'checkmark'],
      control: { type: 'select' },
    },
    error: { control: 'text' },
    onChange: { action: 'onChange' },
    value: { control: 'number' },
    detailText: { control: 'text' },
    autoFocus: { control: 'boolean' },
    numeric: { control: 'boolean' },
    password: { control: 'boolean' },
    allowDecimals: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export const DefaultStory = (args) => {
  const [value, setValue] = useState('');
  return (
    <div style={{ width: '600px' }}>
      <FormField {...args} onChange={setValue} value={value} />
    </div>
  );
};

DefaultStory.storyName = 'Default';
DefaultStory.args = {
  numeric: false,
  titleText: 'Title',
};

export const FormFieldWithTitleDetail = (args) => {
  const [clicked, setClicked] = useState(false);
  const detailOptions = {
    text: <div style={{ fontSize: '12px' }}>Detail</div>,
    button: (
      <button
        style={{
          backgroundColor: clicked
            ? 'var(--color-warning-default)'
            : 'var(--color-background-alternative)',
        }}
        onClick={() => setClicked(!clicked)}
      >
        Click Me
      </button>
    ),
    checkmark: <i className="fas fa-check" />,
  };

  return <FormField {...args} titleDetail={detailOptions[args.titleDetail]} />;
};

FormFieldWithTitleDetail.args = {
  titleText: 'Title',
  titleDetail: 'text',
};

export const FormFieldWithError = (args) => {
  return <FormField {...args} />;
};

FormFieldWithError.args = {
  titleText: 'Title',
  error: 'Incorrect Format',
};
