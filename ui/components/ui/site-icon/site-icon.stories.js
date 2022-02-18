import React from 'react';

import README from './README.mdx';
import SiteIcon from '.';

export default {
  title: 'Components/UI/SiteIcon',
  id: __filename,
  component: SiteIcon,
  parameters: {
    docs: {
      page: README,
    },
  },
  argTypes: {
    icon: {
      control: 'text',
    },
    name: {
      control: 'text',
    },
    size: {
      control: 'number',
    },
  },
};

export const DefaultStory = (args) => <SiteIcon {...args} />;

DefaultStory.storyName = 'Default';

DefaultStory.args = {
  name: 'ubq',
  icon: './images/ubq_logo.svg',
  size: 24,
};

export const Fallback = (args) => <SiteIcon {...args} />;

Fallback.args = {
  name: 'ubq',
  size: 24,
};
