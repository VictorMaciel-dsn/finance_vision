import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useRecoilValue } from 'recoil';
import { currentColor } from '../../atoms/theme/index';
import InfoSection from './infoSection';

function ModalAddInfos({ isOpen = false, setIsOpen = () => {}, intl = '' }) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);
  const [activeSection, setActiveSection] = useState(null);
  const [entries, setEntries] = useState('');
  const [payable, setPayable] = useState('');
  const [invested, setInvested] = useState('');
  const [payments, setPayments] = useState('');

  function submitEntries(e) {
    e.preventDefault();
    alert('Entradas');
  }

  function submitPayable(e) {
    e.preventDefault();
    alert('A pagar');
  }

  function submitInvested(e) {
    e.preventDefault();
    alert('Investimentos');
  }

  function submitPayments(e) {
    e.preventDefault();
    alert('Pagamentos');
  }

  return (
    <Modal
      data-theme={theme}
      centered={true}
      className="modal-add-infos"
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <ModalHeader>{messages['message.whatValueToAdd']}</ModalHeader>
      <ModalBody>
        <InfoSection
          title={messages['message.entries']}
          value={entries}
          setValue={setEntries}
          isOpen={activeSection === 'entries'}
          toggleOpen={() => setActiveSection(activeSection === 'entries' ? null : 'entries')}
          onSubmit={submitEntries}
          icon="pi pi-dollar"
          color="positive"
          placeholderText={messages['message.enterTheValue']}
        />
        <InfoSection
          title={messages['message.payable']}
          value={payable}
          setValue={setPayable}
          isOpen={activeSection === 'payable'}
          toggleOpen={() => setActiveSection(activeSection === 'payable' ? null : 'payable')}
          onSubmit={submitPayable}
          icon="pi pi-dollar"
          color="negative"
          placeholderText={messages['message.enterTheValue']}
        />
        <InfoSection
          title={messages['message.investments']}
          value={invested}
          setValue={setInvested}
          isOpen={activeSection === 'invested'}
          toggleOpen={() => setActiveSection(activeSection === 'invested' ? null : 'invested')}
          onSubmit={submitInvested}
          icon="pi pi-check-circle"
          color="null"
          placeholderText={messages['message.enterTheValue']}
        />
        <InfoSection
          title={messages['message.payments']}
          value={payments}
          setValue={setPayments}
          isOpen={activeSection === 'payments'}
          toggleOpen={() => setActiveSection(activeSection === 'payments' ? null : 'payments')}
          onSubmit={submitPayments}
          icon="pi pi-check-circle"
          color="negative"
          placeholderText={messages['message.enterTheValue']}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          className="close-btn"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <i className="pi pi-times" /> {messages['message.close']}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default injectIntl(ModalAddInfos);
