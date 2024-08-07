import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row } from 'reactstrap';
import { useRecoilValue } from 'recoil';
import { currentColor } from '../../atoms/theme/index';
import { Colxx } from '../common/customBootstrap';
import { Dropdown } from 'primereact/dropdown';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { getTranslatedBanks } from '../../helpers/format';
import { bankOptionTemplate, createDaysOptions, selectedBankTemplate } from '../../helpers/utils';
import { InputText } from 'primereact/inputtext';

function ModalAddCard({ isOpen = false, setIsOpen = () => {}, intl = '' }) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);
  const translatedBanks = getTranslatedBanks(intl);
  const daysOptions = createDaysOptions();
  const [selectedCardIcon, setSelectedCardIcon] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [nameCard, setNameCard] = useState('');
  const [limitCard, setLimitCard] = useState('');
  const [closingDay, setClosingDay] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  function onSubmitForm(e) {
    e.preventDefault();
  }

  return (
    <Modal
      data-theme={theme}
      centered={true}
      className="modal-add-card"
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <form
        onSubmit={(e) => {
          onSubmitForm(e);
        }}
      >
        <ModalHeader>{messages['message.createCard']}</ModalHeader>
        <ModalBody>
          <Row className="mb-2">
            <Colxx xxs={12}>
              <Dropdown
                emptyMessage={messages['message.notData']}
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.value)}
                options={[]} // Contas cadastradas no sistema
                optionLabel="label"
                optionValue="value"
                className="w-100"
                placeholder={messages['message.paymentAccount']}
                appendTo={document.getElementsByClassName('main')[0]}
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
              <Dropdown
                emptyMessage={messages['message.notData']}
                appendTo={document.getElementsByClassName('main')[0]}
                value={selectedCardIcon}
                onChange={(e) => setSelectedCardIcon(e.value)}
                options={translatedBanks}
                optionLabel="name"
                placeholder={messages['message.cardIcon']}
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
                placeholder={messages['message.cardName']}
                value={nameCard}
                onChange={(e) => setNameCard(e.target.value)}
              />
            </Colxx>
          </Row>
          <Row className="mb-2">
            <Colxx xxs={12}>
              <InputText
                required={true}
                className="input-form w-100"
                placeholder={messages['message.totalLimit']}
                value={limitCard}
                onChange={(e) => setLimitCard(e.target.value)}
              />
            </Colxx>
          </Row>
          <Row>
            <Colxx xxs={6}>
              <Dropdown
                // filter
                emptyMessage={messages['message.notData']}
                value={closingDay}
                onChange={(e) => setClosingDay(e.value)}
                options={daysOptions}
                optionLabel="label"
                optionValue="value"
                className="w-100"
                placeholder={messages['message.closingDay']}
                appendTo={document.getElementsByClassName('main')[0]}
                dropdownIcon={(opts) => {
                  return opts.iconProps['data-pr-overlay-visible'] ? (
                    <ChevronUpIcon {...opts.iconProps} />
                  ) : (
                    <ChevronDownIcon {...opts.iconProps} />
                  );
                }}
              />
            </Colxx>
            <Colxx xxs={6}>
              <Dropdown
                // filter
                emptyMessage={messages['message.notData']}
                value={dueDate}
                onChange={(e) => setDueDate(e.value)}
                options={daysOptions}
                optionLabel="label"
                optionValue="value"
                className="w-100"
                placeholder={messages['message.dueDate']}
                appendTo={document.getElementsByClassName('main')[0]}
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

export default injectIntl(ModalAddCard);
