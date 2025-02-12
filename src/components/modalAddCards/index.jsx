import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row } from 'reactstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentColor } from '../../atoms/theme/index';
import { Colxx } from '../common/customBootstrap';
import { Dropdown } from 'primereact/dropdown';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { parseJwt } from '../../helpers/format';
import { createDaysOptions, getCurrentUser } from '../../helpers/utils';
import { InputText } from 'primereact/inputtext';
import { useIonToast } from '@ionic/react';
import { listUpdate, tokenUser } from '../../atoms/user';
import { get, getDatabase, ref, update } from 'firebase/database';
import { currentIsLoad } from '../../atoms/loading';

function ModalAddCard({
  isOpen = false,
  setIsOpen = () => {},
  intl = '',
  selectedCard = null,
  setSelectedCard = () => {},
}) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);
  const daysOptions = createDaysOptions();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [nameCard, setNameCard] = useState('');
  const [limitCard, setLimitCard] = useState('');
  const [closingDay, setClosingDay] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [toast] = useIonToast();
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const [accountOptions, setAccountOptions] = useState([]);
  const setUpdateList = useSetRecoilState(listUpdate);
  const setIsLoading = useSetRecoilState(currentIsLoad);

  useEffect(() => {
    if (isOpen) {
      getListAccounts()
        .then((res) => {
          const _result = Object.values(res).map((x) => ({
            value: x.bank,
            label: x.title,
          }));

          setAccountOptions(_result);
        })
        .catch((error) => {
          console.error('Erro ao obter as contas:', error);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedCard) {
      setNameCard(selectedCard?.nameCard);
      setLimitCard(selectedCard?.limitCard);
      setDueDate(selectedCard?.dueDate);
      setClosingDay(selectedCard?.closingDay);
      setSelectedAccount(selectedCard?.paymentAccount);
    }
  }, [isOpen, selectedCard]);

  const toggle = () => {
    setIsOpen(!isOpen);
    setSelectedAccount(null);
    setSelectedCard(null);
    setNameCard('');
    setLimitCard('');
    setClosingDay(null);
    setDueDate(null);
    setAccountOptions([]);
  };

  async function onSubmitForm(e) {
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
        id: selectedCard ? selectedCard?.id : Math.floor(Math.random() * 1000) + 1,
        paymentAccount: selectedAccount,
        nameCard: nameCard,
        limitCard: limitCard,
        closingDay: closingDay,
        dueDate: dueDate,
      };

      await update(userRef, { [`cards/${payload.id}`]: payload });

      toggle();
      setUpdateList(true);
      toast({
        message: messages['message.cardSaveSuccess'],
        duration: 2000,
        position: 'bottom',
      });
    } catch (error) {
      console.error(error);
      toast({
        message: messages['message.cardSaveError'],
        duration: 2000,
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function getListAccounts() {
    const db = getDatabase();
    const user = userToken || _userToken;
    const userId = parseJwt(user).user_id;

    if (userId) {
      const dataRef = ref(db, `users/${userId}/accounts`);
      try {
        const res = await get(dataRef);
        return res.val();
      } catch {
        return null;
      }
    }
  }

  return (
    <>
      <Modal
        data-theme={theme}
        centered={true}
        className="modal-add-card"
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
          <ModalHeader>{!selectedCard ? messages['message.createCard'] : messages['message.editCard']}</ModalHeader>
          <ModalBody>
            <Row className="mb-2">
              <Colxx xxs={12}>
                <Dropdown
                  emptyMessage={messages['message.notData']}
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.value)}
                  options={accountOptions}
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

export default injectIntl(ModalAddCard);
