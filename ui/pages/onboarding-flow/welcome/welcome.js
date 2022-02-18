import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import Button from '../../../components/ui/button';
import Typography from '../../../components/ui/typography/typography';
import {
  TYPOGRAPHY,
  FONT_WEIGHT,
  TEXT_ALIGN,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { setFirstTimeFlowType } from '../../../store/actions';
import { ONBOARDING_CREATE_PASSWORD_ROUTE, ONBOARDING_IMPORT_WITH_SRP_ROUTE } from '../../../helpers/constants/routes';

export default function OnboardingWelcome() {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();

  const onCreateClick = () => {
    dispatch(setFirstTimeFlowType('create'));
    history.push(ONBOARDING_CREATE_PASSWORD_ROUTE);
  };

  const onImportClick = () => {
    dispatch(setFirstTimeFlowType('import'));
    history.push(ONBOARDING_IMPORT_WITH_SRP_ROUTE);
  };

  return (
    <div className="onboarding-welcome">
      <Carousel showThumbs={false} showStatus={false} showArrows>
        <div>
          <Typography
            variant={TYPOGRAPHY.H2}
            align={TEXT_ALIGN.CENTER}
            fontWeight={FONT_WEIGHT.BOLD}
          >
            {t('welcomeToMetaMask')}
          </Typography>
          <Typography align={TEXT_ALIGN.CENTER}>
            {t('welcomeToMetaMaskIntro')}
          </Typography>
          <div className="onboarding-welcome__mascot">
            <img src="images/icon-512.png" width="250" height="250" />
          </div>
        </div>
        <div>
          <Typography
            variant={TYPOGRAPHY.H2}
            align={TEXT_ALIGN.CENTER}
            fontWeight={FONT_WEIGHT.BOLD}
          >
            {t('welcomeExploreTitle')}
          </Typography>
          <Typography align={TEXT_ALIGN.CENTER}>
            {t('welcomeExploreDescription')}
          </Typography>
          <div className="onboarding-welcome__image">
            <img
              src="/images/onboarding-welcome-say-hello.svg"
              width="169"
              height="237"
              alt=""
            />
          </div>
        </div>
        <div>
          <Typography
            variant={TYPOGRAPHY.H2}
            align={TEXT_ALIGN.CENTER}
            fontWeight={FONT_WEIGHT.BOLD}
          >
            {t('welcomeLoginTitle')}
          </Typography>
          <Typography align={TEXT_ALIGN.CENTER}>
            {t('welcomeLoginDescription')}
          </Typography>
          <div className="onboarding-welcome__image">
            <img
              src="/images/onboarding-welcome-decentralised-apps.svg"
              width="327"
              height="256"
              alt=""
            />
          </div>
        </div>
      </Carousel>
      <ul className="onboarding-welcome__buttons">
        <li>
          <Button
            data-testid="onboarding-create-wallet"
            type="primary"
            onClick={onCreateClick}
          >
            {t('onboardingCreateWallet')}
          </Button>
        </li>
        <li>
          <Button
            data-testid="onboarding-import-wallet"
            type="secondary"
            onClick={onImportClick}
          >
            {t('onboardingImportWallet')}
          </Button>
        </li>
      </ul>
    </div>
  );
}
