import { Button, Row } from 'reactstrap';
import Footer from '../../footer';
import TopNav from '../../topnav';
import { Colxx } from '../../../../components/common/customBootstrap';
import { injectIntl } from 'react-intl';
import { getTranslatedMonths, parseJwt } from '../../../../helpers/format';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useRef, useState } from 'react';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { InputText } from 'primereact/inputtext';
import { getCurrentUser } from '../../../../helpers/utils';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { listUpdate, tokenUser } from '../../../../atoms/user';
import { get, getDatabase, ref, update } from 'firebase/database';
import { useIonToast } from '@ionic/react';
import ModalDelete from '../../../../components/modalDelete';
import { currentIsLoad } from '../../../../atoms/loading';
import { isCurrentMonth, isCurrentYear } from '../../../../atoms/filters';

function HistoricPage({ intl }) {
  const { messages } = intl;
  const translatedMonths = getTranslatedMonths(intl);
  const [selectedMonth, setSelectedMonth] = useRecoilState(isCurrentMonth);
  const [currentYear, setCurrentYear] = useRecoilState(isCurrentYear);
  const isFirst = useRef(true);
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const [list, setList] = useState([]);
  const [totalExits, setTotalExits] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateList, setUpdateList] = useRecoilState(listUpdate);
  const [editItemId, setEditItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({ label: '', value: '' });
  const [toast] = useIonToast();
  const setIsLoading = useSetRecoilState(currentIsLoad);

  useEffect(() => {
    if (isFirst.current || updateList || (selectedMonth && currentYear.toString().length === 4)) {
      setIsLoading(true);

      getInfos()
        .then((res) => {
          setIsLoading(false);
          if (res) {
            delete res.image;
            const _data = res;
            const _dataFormated = [];
            let entries = 0;
            let exits = 0;

            const getMonthAndYear = (dateStr) => {
              const [datePart] = dateStr.split(',');
              const [, month, year] = datePart.trim().split('/');
              return {
                month: parseInt(month, 10),
                year: parseInt(year, 10),
              };
            };

            const formatValues = (items, label, updateTotal) => {
              if (items) {
                Object.values(items).forEach((item) => {
                  const { month, year } = getMonthAndYear(item?.date);

                  if (month === selectedMonth && year === currentYear) {
                    updateTotal(parseFloat(item?.value));
                    _dataFormated.push({ ...item, label });
                  }
                });
              }
            };

            formatValues(_data?.entries, 'Entradas', (value) => (entries += value));
            formatValues(_data?.invested, 'Investimentos', (value) => (entries += value));
            formatValues(_data?.payable, 'A pagar', (value) => (exits += value));
            formatValues(_data?.payments, 'Pagamentos', (value) => (exits += value));

            setTotalExits(exits);
            setTotalEntries(entries);
            setList(_dataFormated);
            setUpdateList(false);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Erro ao obter as informações:', error);
        });

      isFirst.current = false;
    }
  }, [updateList, selectedMonth, currentYear]);

  async function getInfos() {
    const db = getDatabase();
    const user = userToken || _userToken;
    const userId = parseJwt(user).user_id;

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

  const handleEditChange = (field, value) => {
    setEditedItem({
      ...editedItem,
      [field]: value,
    });
  };

  const saveEdit = () => {
    getInfos().then((res) => {
      if (res) {
        setIsLoading(true);
        const _data = res;
        const targetId = editItemId;
        const newValue = editedItem.value;
        const db = getDatabase();
        const user = userToken || _userToken;
        const userId = parseJwt(user).user_id;
        const userRef = ref(db, `users/${userId}`);

        const updateItemById = (data, id, newValue) => {
          for (const key in data) {
            if (data[key][id]) {
              data[key][id].value = newValue;
              break;
            }
          }
        };

        updateItemById(_data, targetId, newValue);

        update(userRef, _data)
          .then(() => {
            setIsLoading(false);
            toast({
              message: messages['message.registerUpdateSuccess'],
              duration: 2000,
              position: 'bottom',
            });
            setEditItemId(null);
            setEditedItem({ label: '', value: '' });
            setUpdateList(true);
          })
          .catch((error) => {
            setIsLoading(false);
            toast({
              message: messages['message.registerUpdateError'],
              duration: 2000,
              position: 'bottom',
            });
            console.error('Erro ao atualizar a lista no Firebase:', error);
          });
      }
    });
  };

  return (
    <>
      <ModalDelete
        isOpen={modalConfirm}
        setIsOpen={setModalConfirm}
        item={selectedItem}
        type="item"
        setSelectedItem={setSelectedItem}
      />
      <div className="historic-page">
        <TopNav />
        <div className="wow animate__animated animate__fadeIn">
          <div className="container-filter">
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
          <Row className="total-balance">
            <Colxx xxs={6}>
              {messages['message.entries']}: <span className="positive">R$ {totalEntries.toFixed(2)}</span>
            </Colxx>
            <Colxx xxs={6}>
              {messages['message.exits']}: <span className="negative">R$ {totalExits.toFixed(2)}</span>
            </Colxx>
          </Row>
          <div className="container-historic">
            {list &&
              list.map((item) => {
                const isEdit = editItemId === item.id;
                return (
                  <div key={item.id} className="card">
                    <Row>
                      <Colxx xxs={isEdit ? 7 : 8}>
                        <div>
                          <b>{messages['message.type']}: </b>
                          <span className={`label ${item.label.toLowerCase()}`}>{item.label}</span>
                        </div>
                        <div>
                          <b>{messages['message.value']}: </b>
                          {isEdit ? (
                            <InputText
                              required
                              type="number"
                              className="input-form"
                              placeholder={messages['message.informValue']}
                              value={editedItem.value}
                              onChange={(e) => handleEditChange('value', e.target.value)}
                            />
                          ) : (
                            item.value
                          )}
                        </div>
                        <div>
                          <b>{messages['message.date']}:</b> {item.date}
                        </div>
                      </Colxx>
                      <Colxx xxs={isEdit ? 5 : 4}>
                        <div className="actions-btn">
                          {isEdit ? (
                            <Button className="btn-save" onClick={saveEdit}>
                              <i className="pi pi-check" />
                            </Button>
                          ) : (
                            <></>
                          )}
                          <Button
                            className="btn-edit"
                            onClick={() => {
                              setEditItemId(isEdit ? null : item.id);
                              setEditedItem(isEdit ? { label: '', value: '' } : item);
                            }}
                          >
                            {isEdit ? <i className="pi pi-times" /> : <i className="pi pi-pencil" />}
                          </Button>
                          <Button
                            className={`btn-del ${isEdit ? 'edit' : ''}`}
                            onClick={() => {
                              setSelectedItem(item);
                              setModalConfirm(!modalConfirm);
                            }}
                          >
                            <i className="pi pi-trash" />
                          </Button>
                        </div>
                      </Colxx>
                    </Row>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default injectIntl(HistoricPage);
