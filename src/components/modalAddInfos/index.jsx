import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentColor } from '../../atoms/theme/index';
import InfoSection from './infoSection';
import { getCurrentUser } from '../../helpers/utils';
import { listUpdate, tokenUser } from '../../atoms/user';
import { parseJwt } from '../../helpers/format';
import { getDatabase, ref, update } from 'firebase/database';
import { useIonToast } from '@ionic/react';
import { currentIsLoad } from '../../atoms/loading';

function ModalAddInfos({ isOpen = false, setIsOpen = () => {}, intl = '' }) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);
  const [activeSection, setActiveSection] = useState(null);
  const [entries, setEntries] = useState('');
  const [payable, setPayable] = useState('');
  const [invested, setInvested] = useState('');
  const [payments, setPayments] = useState('');
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const [toast] = useIonToast();
  const setUpdateList = useSetRecoilState(listUpdate);
  const setIsLoading = useSetRecoilState(currentIsLoad);

  const submitData = (type, value, setValue) => async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = parseJwt(_userToken || userToken);

      if (!user) {
        throw new Error(messages['message.userNotAccess']);
      }

      const userId = user.user_id;
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);

      const payload = {
        id: Math.floor(Math.random() * 1000) + 1,
        value,
        date: new Date().toLocaleString('pt-BR', { hour12: false }),
      };

      await update(userRef, { [`${type}/${payload.id}`]: payload });

      setValue('');
      setUpdateList(true);
      toast({
        message: messages['message.valueSaveSuccess'],
        duration: 2000,
        position: 'bottom',
      });
    } catch (error) {
      console.error(error);
      toast({
        message: messages['message.valueSaveError'],
        duration: 2000,
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
            onSubmit={submitData('entries', entries, setEntries)}
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
            onSubmit={submitData('payable', payable, setPayable)}
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
            onSubmit={submitData('invested', invested, setInvested)}
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
            onSubmit={submitData('payments', payments, setPayments)}
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
              setActiveSection(null);
              setEntries('');
              setPayable('');
              setInvested('');
              setPayments('');
            }}
          >
            <i className="pi pi-times" /> {messages['message.close']}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default injectIntl(ModalAddInfos);
