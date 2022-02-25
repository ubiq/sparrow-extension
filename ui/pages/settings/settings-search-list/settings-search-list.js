import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { highlightSearchedText } from '../../../helpers/utils/settings-search';
import { I18nContext } from '../../../contexts/i18n';

export default function SettingsSearchList({ results, onClickSetting }) {
  const t = useContext(I18nContext);

  useEffect(highlightSearchedText, [results]);

  return (
    <div className="settings-page__header__search__list">
      {results.slice(0, 5).map((result) => {
        const { image, tab, section, id } = result;
        return (
          Boolean(image || tab || section) && (
            <div key={`settings_${id}`}>
              <div
                className="settings-page__header__search__list__item"
                onClick={() => onClickSetting(result)}
              >
                <img
                  className="settings-page__header__search__list__item__icon"
                  src={`./images/${image}`}
                />

                <span
                  id={`menu-tab_${id}`}
                  className={classnames(
                    'settings-page__header__search__list__item__tab',
                    {
                      'settings-page__header__search__list__item__tab-multiple-lines':
                        tab === t('securityAndPrivacy'),
                    },
                  )}
                >
                  {tab}
                </span>
                <div className="settings-page__header__search__list__item__caret" />
                <span
                  id={`menu-section_${id}`}
                  className={classnames(
                    'settings-page__header__search__list__item__section',
                    {
                      'settings-page__header__search__list__item__section-multiple-lines':
                        tab === t('securityAndPrivacy') || tab === t('alerts'),
                    },
                  )}
                >
                  {section}
                </span>
              </div>
            </div>
          )
        );
      })}
      {results.length === 0 && (
        <div
          className="settings-page__header__search__list__item"
          style={{ cursor: 'auto', display: 'flex' }}
        >
          <span className="settings-page__header__search__list__item__no-matching">
            {t('settingsSearchMatchingNotFound')}
          </span>
        </div>
      )}
      <div
        className="settings-page__header__search__list__item"
        style={{ cursor: 'auto', display: 'flex' }}
      >
        <span className="settings-page__header__search__list__item__request">
          {t('missingSetting')}
        </span>
        <a
          href="https://community.metamask.io/c/feature-requests-ideas/13"
          target="_blank"
          rel="noopener noreferrer"
          key="need-help-link"
          className="settings-page__header__search__list__item__link"
        >
          {t('missingSettingRequest')}
        </a>
      </div>
    </div>
  );
}

SettingsSearchList.propTypes = {
  results: PropTypes.array,
  onClickSetting: PropTypes.func,
};
