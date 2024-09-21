import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row } from 'reactstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentColor } from '../../atoms/theme/index';
import { Colxx } from '../common/customBootstrap';
import { Dropdown } from 'primereact/dropdown';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { /* getTranslatedBanks */ parseJwt } from '../../helpers/format';
import {
  /* bankOptionTemplate */ createDaysOptions,
  getCurrentUser /* selectedBankTemplate */,
} from '../../helpers/utils';
import { InputText } from 'primereact/inputtext';
import LoadingComponent from '../loading';
import { useIonToast } from '@ionic/react';
import { listUpdate, tokenUser } from '../../atoms/user';
import { get, getDatabase, ref, update } from 'firebase/database';

function ModalAddCard({
  isOpen = false,
  setIsOpen = () => {},
  intl = '',
  selectedCard = null,
  setSelectedCard = () => {},
}) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);
  // const translatedBanks = getTranslatedBanks(intl);
  const daysOptions = createDaysOptions();
  // const [selectedCardIcon, setSelectedCardIcon] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [nameCard, setNameCard] = useState('');
  const [limitCard, setLimitCard] = useState('');
  const [closingDay, setClosingDay] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast] = useIonToast();
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const [accountOptions, setAccountOptions] = useState([]);
  const setUpdateList = useSetRecoilState(listUpdate);

  useEffect(() => {
    if (isOpen) {
      getListAccounts()
        .then((res) => {
          const _result = Object.values(res).map((x) => ({
            value: x.bank,
            label: x.title,
          }));

          setAccountOptions(_result);
          // console.log(_result);
          // setIsLoading(false);
        })
        .catch((error) => {
          // setIsLoading(false);
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
    // setSelectedCardIcon(null);
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
        throw new Error('Usuário não autenticado');
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
        message: 'Cartão salvo com sucesso!',
        duration: 2000,
        position: 'bottom',
      });
    } catch (error) {
      console.error(error);
      toast({
        message: 'Houve um erro ao salvar o cartão!',
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
      <LoadingComponent isLoading={isLoading} text={messages['message.wait']} />
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
          <ModalHeader>{!selectedCard ? messages['message.createCard'] : 'Editar cartão'}</ModalHeader>
          <ModalBody>
            <Row className="mb-2">
              <Colxx xxs={12}>
                <Dropdown
                  emptyMessage={messages['message.notData']}
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.value)}
                  options={accountOptions} // Contas cadastradas no sistema
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
            {/* <Row className="mb-2">
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
            </Row> */}
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
