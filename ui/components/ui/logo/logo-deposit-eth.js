import React from 'react';
import PropTypes from 'prop-types';

const LogoDepositEth = ({
  width = '100%',
  color = 'var(--color-text-default)',
  className,
  ariaLabel,
}) => {
  return (
    <svg
      width={width}
      fill={color}
      className={className}
      aria-label={ariaLabel}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="34" cy="35" r="34" fill="#fff" fillRule="evenodd" />
      <circle
        cx="34"
        cy="35"
        r="32.5"
        fill="none"
        stroke="#38393a"
        strokeWidth="3"
      />
      <g transform="translate(46,45)" fill="none" fillRule="evenodd">
        <circle cx="17" cy="17" r="17" fill="#fff" />
        <circle cx="17" cy="17" r="15.5" stroke="#38393a" strokeWidth="3" />
        <path
          d="m19.077 15.423h6.423v4.154h-6.423v6.423h-4.154v-6.423h-6.423v-4.154h6.423v-6.423h4.154z"
          fill="#38393a"
        />
      </g>
      <g transform="matrix(.035831 0 0 -.035831 12.502 56.498)" fill="#38393a">
        <g transform="matrix(1.4678 0 0 1.4678 -304.34 -573.04)" fill="#38393a">
          <g transform="matrix(1.5369 0 0 1.5369 284.48 673.46)">
            <path d="m0 0 149.46-89.981v204.21z" fill="#38393a" />
          </g>
          <g transform="matrix(1.5369 0 0 1.5369 638.4 1179.5)">
            <path d="m0 0v-196.57l-230.28-132.69v199.63z" fill="#38393a" />
          </g>
          <g transform="matrix(1.5369 0 0 1.5369 947.78 924.93)">
            <path d="m0 0-149.46 89.975v-204.2z" fill="#38393a" />
          </g>
          <g transform="matrix(1.5369 0 0 1.5369 593.87 418.9)">
            <path d="m0 0v196.57l230.28 132.69v-199.63z" fill="#38393a" />
          </g>
        </g>
      </g>
    </svg>
  );
};

LogoDepositEth.propTypes = {
  /**
   * The width of the logo. Defaults to 100%
   */
  width: PropTypes.string,
  /**
   * The color of the logo defaults to var(--color-text-default)
   */
  color: PropTypes.string,
  /**
   * Additional className to add to the root svg
   */
  className: PropTypes.string,
  /**
   * Aria label to add to the logo component
   */
  ariaLabel: PropTypes.string,
};

export default LogoDepositEth;
