import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row } from 'reactstrap';
import { useRecoilValue } from 'recoil';
import { currentColor } from '../../atoms/theme/index';
import { Colxx } from '../common/customBootstrap';
import { Dropdown } from 'primereact/dropdown';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { getTranslatedBanks, parseJwt } from '../../helpers/format';
import { InputText } from 'primereact/inputtext';
import { useIonToast } from '@ionic/react';
import { bankOptionTemplate, getCurrentUser, selectedBankTemplate } from '../../helpers/utils';
import { tokenUser } from '../../atoms/user';
import { getDatabase, ref, update } from 'firebase/database';
import LoadingComponent from '../loading';

function ModalAddAccounts({ isOpen = false, setIsOpen = () => {}, intl = '' }) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);
  const translatedBanks = getTranslatedBanks(intl);
  const [selectedBank, setSelectedBank] = useState(null);
  const [titleAccount, setTitleAccount] = useState('');
  const [balanceAccount, setBalanceAccount] = useState('');
  const [toast] = useIonToast();
  const [isLoading, setIsLoading] = useState(false);
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);

  const toggle = () => {
    setIsOpen(!isOpen);
    setSelectedBank(null);
    setTitleAccount('');
    setBalanceAccount('');
  };

  async function onSubmitForm(e) {
    e.preventDefault();

    if (!selectedBank) {
      toast({
        message: messages['message.selectAccountIcon'],
        duration: 2000,
        position: 'bottom',
      });
      return;
    } else {
      setIsLoading(true);

      try {
        const user = parseJwt(_userToken || userToken);

        if (!user) {
          throw new Error('Usuário não autenticado');
        }

        const userId = user.user_id;
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);

        const payload = {
          id: Math.floor(Math.random() * 1000) + 1,
          bank: selectedBank.code,
          title: titleAccount,
          balance: balanceAccount,
        };

        await update(userRef, { [`accounts/${payload.id}`]: payload });

        toggle();
        // setUpdateList(true);
        toast({
          message: 'Conta salva com sucesso!',
          duration: 2000,
          position: 'bottom',
        });
      } catch (error) {
        console.error(error);
        toast({
          message: 'Houve um erro ao salvar a conta!',
          duration: 2000,
          position: 'bottom',
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <LoadingComponent isLoading={isLoading} text={messages['message.wait']} />
      <Modal
        data-theme={theme}
        centered={true}
        className="modal-add-accounts"
        isOpen={isOpen}
        toggle={() => {
          toggle();
        }}
      >
        <form
          onSubmit={(e) => {
            onSubmitForm(e);
          }}
        >
          <ModalHeader>Criar nova conta</ModalHeader>
          <ModalBody>
            <Row className="mb-2">
              <Colxx xxs={12}>
                <Dropdown
                  emptyMessage={messages['message.notData']}
                  appendTo={document.getElementsByClassName('main')[0]}
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.value)}
                  options={translatedBanks}
                  optionLabel="name"
                  placeholder={messages['message.selectAccountIcon']}
                  valueTemplate={selectedBankTemplate}
                  itemTemplate={bankOptionTemplate}
                  className="w-100"
                  dropdownIcon={(opts) => {
                    return opts.iconProps['data-pr-overlay-visible'] ? (
                      <ChevronUpIcon {...opts.iconProps} />
                    ) : (
                      <ChevronDownIcon {...opts.iconProps} />
                    );
                  }}
                />
              </Colxx>
            </Row>
            <Row className="mb-2">
              <Colxx xxs={12}>
                <InputText
                  required={true}
                  className="input-form w-100"
                  placeholder={messages['message.titleAccount']}
                  value={titleAccount}
                  onChange={(e) => setTitleAccount(e.target.value)}
                />
              </Colxx>
            </Row>
            <Row>
              <Colxx xxs={12}>
                <InputText
                  required={true}
                  className="input-form w-100"
                  placeholder={messages['message.balanceAccount']}
                  value={balanceAccount}
                  onChange={(e) => setBalanceAccount(e.target.value)}
                />
              </Colxx>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              className="close-btn"
              type="button"
              onClick={() => {
                toggle();
              }}
            >
              <i className="pi pi-times" /> {messages['message.cancel']}
            </Button>
            <Button className="save-btn" type="submit">
              <i className="pi pi-save" /> {messages['message.save']}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}

export default injectIntl(ModalAddAccounts);
