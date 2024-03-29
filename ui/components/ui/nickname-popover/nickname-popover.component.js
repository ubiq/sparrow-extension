import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { I18nContext } from '../../../contexts/i18n';
import Tooltip from '../tooltip';
import Popover from '../popover';
import Button from '../button';
import Identicon from '../identicon/identicon.component';
import { shortenAddress } from '../../../helpers/utils/util';
import CopyIcon from '../icon/copy-icon.component';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';

const NicknamePopover = ({
  address,
  nickname,
  onClose = null,
  onAdd = null,
  explorerLink,
}) => {
  const t = useContext(I18nContext);

  const onAddClick = useCallback(() => {
    onAdd();
  }, [onAdd]);

  const [copied, handleCopy] = useCopyToClipboard();

  return (
    <div className="nickname-popover">
      <Popover onClose={onClose} className="nickname-popover__popover-wrap">
        <Identicon
          address={address}
          diameter={36}
          className="nickname-popover__identicon"
        />
        <div className="nickname-popover__address">
          {nickname || shortenAddress(address)}
        </div>
        <div className="nickname-popover__public-address">
          <div className="nickname-popover__public-address__constant">
            {address}
          </div>

          <Tooltip
            position="bottom"
            title={copied ? t('copiedExclamation') : t('copyToClipboard')}
          >
            <button
              type="link"
              onClick={() => {
                handleCopy(address);
              }}
              title=""
            >
              <CopyIcon size={11} color="var(--color-icon-default)" />
            </button>
          </Tooltip>
        </div>

        <div className="nickname-popover__view-on-block-explorer">
          <Button
            type="link"
            className="nickname-popover__etherscan-link"
            onClick={() => {
              global.platform.openTab({
                url: explorerLink,
              });
            }}
            target="_blank"
            rel="noopener noreferrer"
            title={t('etherscanView')}
          >
            {t('viewOnBlockExplorer')}
          </Button>
        </div>
        <Button
          type="primary"
          className="nickname-popover__footer-button"
          onClick={onAddClick}
        >
          {nickname ? t('editANickname') : t('addANickname')}
        </Button>
      </Popover>
    </div>
  );
};

NicknamePopover.propTypes = {
  address: PropTypes.string,
  nickname: PropTypes.string,
  onClose: PropTypes.func,
  onAdd: PropTypes.func,
  explorerLink: PropTypes.string,
};

export default NicknamePopover;
