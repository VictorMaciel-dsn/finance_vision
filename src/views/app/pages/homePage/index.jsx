import { Button, Card, CardBody, CardHeader, Row } from 'reactstrap';
import Footer from '../../footer';
import TopNav from '../../topnav';
import { Colxx } from '../../../../components/common/customBootstrap';
import { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { injectIntl } from 'react-intl';
import { getTranslatedMonths, parseJwt } from '../../../../helpers/format';
import ModalAddCard from '../../../../components/modalAddCards';
import ModalAddAccounts from '../../../../components/modalAddAccounts';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { InputText } from 'primereact/inputtext';
import { get, getDatabase, ref } from 'firebase/database';
import { getCurrentUser } from '../../../../helpers/utils';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { listUpdate, tokenUser } from '../../../../atoms/user';
import PanelTotalBalance from '../../../../components/panelTotalBalance';
import ModalDelete from '../../../../components/modalDelete';
import { currentIsLoad } from '../../../../atoms/loading';
import { isCurrentMonth, isCurrentYear } from '../../../../atoms/filters';

function HomePage({ intl }) {
  const { messages } = intl;
  const translatedMonths = getTranslatedMonths(intl);
  const [modalAddCards, setModalAddCards] = useState(false);
  const [modalAddAccounts, setModalAddAccounts] = useState(false);
  const isFirst = useRef(true);
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const [totalBalance, setTotalBalance] = useState(0);
  const [entriesTotal, setEntriesTotal] = useState(0);
  const [payableTotal, setPayableTotal] = useState(0);
  const [investedTotal, setInvestedTotal] = useState(0);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [updateList, setUpdateList] = useRecoilState(listUpdate);
  const userId = getUserId(userToken, _userToken);
  const [myAccounts, setMyAccounts] = useState([]);
  const [myCards, setMyCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalConfirmDeleteCard, setModalConfirmDeleteCard] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalConfirmDeleteAccount, setModalConfirmDeleteAccount] = useState(false);
  const opPanelTotalBance = useRef();
  const setIsLoading = useSetRecoilState(currentIsLoad);
  const [selectedMonth, setSelectedMonth] = useRecoilState(isCurrentMonth);
  const [currentYear, setCurrentYear] = useRecoilState(isCurrentYear);

  useEffect(() => {
    if (isFirst.current || updateList || (selectedMonth && currentYear.toString().length === 4)) {
      setIsLoading(true);
      setUpdateList(false);

      const getMonthAndYear = (dateStr) => {
        const [datePart] = dateStr.split(',');
        const [, month, year] = datePart.trim().split('/');
        return {
          month: parseInt(month, 10),
          year: parseInt(year, 10),
        };
      };

      const calculateTotal = (data) => {
        return Object.values(data || {}).reduce((acc, item) => {
          const { month, year } = getMonthAndYear(item?.date);
          if (month === selectedMonth && year === currentYear) {
            return acc + parseFloat(item.value);
          }
          return acc;
        }, 0);
      };

      const updateTotals = (res) => {
        delete res.image;
        const { entries = {}, invested = {}, payable = {}, payments = {}, accounts = {} } = res;

        const totalAccountsBalance = Object.values(accounts).reduce((sum, x) => {
          return sum + Number(x.balance);
        }, 0);

        setTotalBalance(calculateTotal(entries) + calculateTotal(invested) + totalAccountsBalance);
        setEntriesTotal(calculateTotal(entries));
        setInvestedTotal(calculateTotal(invested));
        setPayableTotal(calculateTotal(payable));
        setPaymentsTotal(calculateTotal(payments));
      };

      getInfos()
        .then((res) => {
          res && updateTotals(res);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Erro ao obter as informações:', error);
        });

      getListAccounts()
        .then((res) => {
          if (res) {
            const _result = Object.values(res).map((x) => ({
              name: x.title,
              balance: Number(x.balance),
              id: x.id,
              bank: x.bank,
            }));
            setMyAccounts(_result);
          } else {
            setMyAccounts([]);
          }
        })
        .catch((error) => {
          console.error('Erro ao obter as contas:', error);
        });

      getListCards()
        .then((res) => {
          if (res) {
            const _result = Object.values(res).map((x) => ({
              closingDay: x.closingDay,
              dueDate: x.dueDate,
              id: x.id,
              limitCard: x.limitCard,
              nameCard: x.nameCard,
              paymentAccount: x.paymentAccount,
            }));
            setMyCards(_result);
          } else {
            setMyCards([]);
          }
        })
        .catch((error) => {
          console.error('Erro ao obter os cartões:', error);
        });

      isFirst.current = false;
    }
  }, [updateList, selectedMonth, currentYear]);

  function getUserId(userToken, _userToken) {
    const user = userToken || _userToken;
    return parseJwt(user).user_id;
  }

  async function getInfos() {
    const db = getDatabase();

    if (userId) {
      const dataRef = ref(db, `users/${userId}`);
      try {
        const res = await get(dataRef);
        return res.val();
      } catch {
        return null;
      }
    }
  }

  async function getListAccounts() {
    const db = getDatabase();

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

  async function getListCards() {
    const db = getDatabase();

    if (userId) {
      const dataRef = ref(db, `users/${userId}/cards`);
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
      <ModalAddCard
        isOpen={modalAddCards}
        setIsOpen={setModalAddCards}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
      />
      <ModalDelete
        isOpen={modalConfirmDeleteCard}
        setIsOpen={setModalConfirmDeleteCard}
        item={selectedCard}
        type="card"
        setSelectedItem={setSelectedCard}
      />
      <ModalDelete
        isOpen={modalConfirmDeleteAccount}
        setIsOpen={setModalConfirmDeleteAccount}
        item={selectedAccount}
        type="account"
        setSelectedItem={setSelectedAccount}
      />
      <ModalAddAccounts
        isOpen={modalAddAccounts}
        setIsOpen={setModalAddAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
      />
      <PanelTotalBalance op={opPanelTotalBance} />
      <div className="home-page">
        <TopNav />
        <div className="container-home wow animate__animated animate__fadeIn">
          <div className="container-filter mb-2">
            <InputText
              className="input-form"
              placeholder={messages['message.year']}
              type="number"
              value={currentYear}
              onChange={(e) => {
                const _val = e.target.value;
                if (_val.length <= 4) {
                  setCurrentYear(_val);
                }
              }}
            />
            <Dropdown
              emptyMessage={messages['message.notData']}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.value)}
              options={translatedMonths}
              optionLabel="label"
              optionValue="value"
              placeholder={messages['message.selectMonth']}
              appendTo={document.getElementsByClassName('main')[0]}
              dropdownIcon={(opts) => {
                return opts.iconProps['data-pr-overlay-visible'] ? (
                  <ChevronUpIcon {...opts.iconProps} />
                ) : (
                  <ChevronDownIcon {...opts.iconProps} />
                );
              }}
            />
          </div>
          <Row className="mb-2">
            <Colxx xxs={12}>
              <Card className="custom-card">
                <div className="custom-item">
                  <i className="positive pi pi-money-bill" />
                </div>
                <div className="total-balance">
                  <div>{messages['message.totalBalance']}</div>
                  <strong>R$ {totalBalance.toFixed(2)}</strong>
                  <i
                    className="pi pi-info-circle"
                    onClick={(e) => {
                      opPanelTotalBance.current.toggle(e);
                    }}
                  />
                </div>
              </Card>
            </Colxx>
          </Row>
          <Row className="mb-2">
            <Colxx xxs={6} style={{ paddingRight: '5px' }}>
              <Card className="custom-card">
                <div className="custom-item">
                  <i className="positive pi pi-dollar" />
                </div>
                <div>
                  <div>{messages['message.entries']}</div>
                  <strong>R$ {entriesTotal.toFixed(2)}</strong>
                </div>
              </Card>
            </Colxx>
            <Colxx xxs={6} style={{ paddingLeft: '5px' }}>
              <Card className="custom-card">
                <div className="custom-item">
                  <i className="negative pi pi-dollar" />
                </div>
                <div>
                  <div>{messages['message.payable']}</div>
                  <strong>R$ {payableTotal.toFixed(2)}</strong>
                </div>
              </Card>
            </Colxx>
          </Row>
          <Row className="mb-2">
            <Colxx xxs={6} style={{ paddingRight: '5px' }}>
              <Card className="custom-card">
                <div className="custom-item">
                  <i className="null pi pi-check-circle" />
                </div>
                <div>
                  <div>{messages['message.investes']}</div>
                  <strong>R$ {investedTotal.toFixed(2)}</strong>
                </div>
              </Card>
            </Colxx>
            <Colxx xxs={6} style={{ paddingLeft: '5px' }}>
              <Card className="custom-card">
                <div className="custom-item">
                  <i className="negative pi pi-check-circle" />
                </div>
                <div>
                  <div>{messages['message.paidOut']}</div>
                  <strong>R$ {paymentsTotal.toFixed(2)}</strong>
                </div>
              </Card>
            </Colxx>
          </Row>
          <Row className="mb-2">
            <Colxx xxs={12}>
              <Card className="card-credit">
                <CardHeader>
                  <div>
                    <b>
                      <i className="pi pi-credit-card" /> {messages['message.myCards']}
                    </b>
                  </div>
                  <div
                    className="custom-btn"
                    onClick={() => {
                      setModalAddCards(!modalAddCards);
                    }}
                  >
                    <i className="pi pi-plus" /> {messages['message.add']}
                  </div>
                </CardHeader>
                <CardBody>
                  {myCards.length > 0 ? (
                    <>
                      {myCards.map((x) => (
                        <div key={x.id} className="container-card">
                          <Row>
                            <Colxx xxs={12}>
                              {messages['message.cardName']}: <b>{x.nameCard}</b>
                            </Colxx>
                          </Row>
                          <Row>
                            <Colxx xxs={7}>
                              <div>
                                {messages['message.closingDay']}: <b>{x.closingDay}</b>
                              </div>
                              <div>
                                {messages['message.dueDateHome']}: <b>{x.dueDate}</b>
                              </div>
                              <div>
                                {messages['message.limitCard']}: <b>{x.limitCard}</b>
                              </div>
                            </Colxx>
                            <Colxx xxs={5}>
                              <Button
                                className="btn-edit"
                                onClick={() => {
                                  setSelectedCard(x);
                                  setModalAddCards(!modalAddAccounts);
                                }}
                              >
                                <i className="pi pi-pencil" />
                              </Button>
                              <Button
                                className="btn-del"
                                onClick={() => {
                                  setSelectedCard(x);
                                  setModalConfirmDeleteCard(!modalAddAccounts);
                                }}
                              >
                                <i className="pi pi-trash" />
                              </Button>
                            </Colxx>
                          </Row>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="no-data">
                      <i className="pi pi-exclamation-circle" /> {messages['message.noCardRegistered']}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Colxx>
          </Row>
          <Row className="mb-2">
            <Colxx xxs={12}>
              <Card className="card-credit">
                <CardHeader>
                  <div>
                    <b>
                      <i className="pi pi-wallet" /> {messages['message.myAccounts']}
                    </b>
                  </div>
                  <div
                    className="custom-btn"
                    onClick={() => {
                      setModalAddAccounts(!modalAddAccounts);
                    }}
                  >
                    <i className="pi pi-plus" /> {messages['message.add']}
                  </div>
                </CardHeader>
                <CardBody>
                  {myAccounts.length > 0 ? (
                    <>
                      {myAccounts.map((x) => (
                        <div key={x.id} className="container-card">
                          <Row>
                            <Colxx xxs={12}>
                              {messages['message.accountName']} <b>{x.name}</b>
                            </Colxx>
                          </Row>
                          <Row>
                            <Colxx xxs={7}>
                              <div>
                                {messages['message.accountBalance']} <b>{x.balance}</b>
                              </div>
                            </Colxx>
                            <Colxx xxs={5}>
                              <Button
                                className="btn-edit"
                                onClick={() => {
                                  setSelectedAccount(x);
                                  setModalAddAccounts(!modalAddAccounts);
                                }}
                              >
                                <i className="pi pi-pencil" />
                              </Button>
                              <Button
                                className="btn-del"
                                onClick={() => {
                                  setSelectedAccount(x);
                                  setModalConfirmDeleteAccount(!modalConfirmDeleteAccount);
                                }}
                              >
                                <i className="pi pi-trash" />
                              </Button>
                            </Colxx>
                          </Row>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="no-data">
                      <i className="pi pi-exclamation-circle" /> {messages['message.noAccountRegistered']}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Colxx>
          </Row>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default injectIntl(HomePage);
