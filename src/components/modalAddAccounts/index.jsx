import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row } from 'reactstrap';
import { useRecoilValue } from 'recoil';
import { currentColor } from '../../atoms/theme/index';
import { Colxx } from '../common/customBootstrap';
import { Dropdown } from 'primereact/dropdown';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { getTranslatedBanks } from '../../helpers/format';
import { InputText } from 'primereact/inputtext';
import { useIonToast } from '@ionic/react';

function ModalAddAccounts({ isOpen = false, setIsOpen = () => {}, intl = '' }) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);
  const [selectedBank, setSelectedBank] = useState(null);
  const translatedBanks = getTranslatedBanks(intl);
  const [titleAccount, setTitleAccount] = useState('');
  const [balanceAccount, setBalanceAccount] = useState('');
  const [toast] = useIonToast();

  const selectedBankTemplate = (option, props) => {
    if (option) {
      return (
        <div className="d-flex align-items-center">
          <img
            alt={option.name}
            src={option.img}
            className={`mr-2 flag flag-${option.code.toLowerCase()}`}
            style={{ width: '25px' }}
          />
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const bankOptionTemplate = (option) => {
    return (
      <div className="d-flex align-items-center">
        <img
          alt={option.name}
          src={option.img}
          className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          style={{ width: '25px' }}
        />
        <div>{option.name}</div>
      </div>
    );
  };

  function onSubmitForm(e) {
    e.preventDefault();
    if (!selectedBank) {
      toast({
        message: messages['message.selectAccountIcon'],
        duration: 2000,
        position: 'bottom',
      });
      return;
    } else {
      alert('Adicionar conta!');
    }
  }

  return (
    <Modal
      data-theme={theme}
      centered={true}
      className="modal-add-accounts"
      isOpen={isOpen}
      toggle={() => {
        setIsOpen(!isOpen);
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
              setIsOpen(!isOpen);
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
  );
}

export default injectIntl(ModalAddAccounts);
