// .storybook/YourTheme.js

import { create } from '@storybook/theming';
import logo from '../app/images/logo/sparrow-logo-horizontal.png';

export default create({
  base: 'light',
  brandTitle: 'MetaMask Storybook',
  brandImage: logo,

  // Typography
  fontBase: 'Euclid, Roboto, Helvetica, Arial, sans-serif',
  fontCode: 'Inconsolata, monospace',
});
