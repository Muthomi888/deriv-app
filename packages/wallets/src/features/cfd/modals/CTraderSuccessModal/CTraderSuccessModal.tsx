import React from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletLoader } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import { THooks } from '../../../../types';
import { PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens';
import { CTraderSuccessModalButtons } from './components';

type TCTraderSuccessModal = {
    createdAccount?: THooks.CreateOtherCFDAccount;
    isDemo?: boolean;
    walletCurrencyType: THooks.WalletAccountsList['wallet_currency_type'];
};

const CTraderSuccessModal = ({ createdAccount, isDemo, walletCurrencyType }: TCTraderSuccessModal) => {
    const { data: cTraderAccounts, isLoading: isCtraderAccountsListLoading } = useCtraderAccountsList();
    const { isDesktop } = useDevice();
    const { hide } = useModal();
    const { localize } = useTranslations();

    const cTraderAccount = cTraderAccounts?.find(account => account.login);
    const isLoading = !cTraderAccounts || isCtraderAccountsListLoading || !cTraderAccount;

    if (isLoading) return <WalletLoader />;

    const description = isDemo
        ? localize('Practise trading with {{ctraderBalance}} virtual funds.', {
              ctraderBalance: cTraderAccount.display_balance,
          })
        : localize(
              'Transfer funds from your {{walletCurrencyType}} Wallet to your {{ctraderTitle}} account to start trading.',
              {
                  ctraderTitle: PlatformDetails.ctrader.title,
                  walletCurrencyType,
              }
          );

    const title = isDemo ? (
        <Localize
            i18n_default_text='Your {{ctraderTitle}} demo account is ready'
            values={{ ctraderTitle: PlatformDetails.ctrader.title }}
        />
    ) : (
        <Localize
            i18n_default_text='Your {{ctraderTitle}} account is ready'
            values={{ ctraderTitle: PlatformDetails.ctrader.title }}
        />
    );

    if (isDesktop) {
        return (
            <ModalWrapper hideCloseButton>
                <CFDSuccess
                    actionButtons={
                        <CTraderSuccessModalButtons createdAccount={createdAccount} hide={hide} isDemo={isDemo} />
                    }
                    description={description}
                    displayBalance={cTraderAccount.display_balance}
                    marketType='all'
                    platform={PlatformDetails.ctrader.platform}
                    title={title}
                />
            </ModalWrapper>
        );
    }
    return (
        <ModalStepWrapper
            renderFooter={() => (
                <CTraderSuccessModalButtons createdAccount={createdAccount} hide={hide} isDemo={isDemo} />
            )}
            title={' '}
        >
            <CFDSuccess
                actionButtons={
                    <CTraderSuccessModalButtons createdAccount={createdAccount} hide={hide} isDemo={isDemo} />
                }
                description={description}
                displayBalance={cTraderAccount.display_balance}
                marketType='all'
                platform={PlatformDetails.ctrader.platform}
                title={title}
            />
        </ModalStepWrapper>
    );
};

export default CTraderSuccessModal;
