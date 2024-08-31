import { Button, Row } from 'reactstrap';
import Footer from '../../footer';
import TopNav from '../../topnav';
import { Colxx } from '../../../../components/common/customBootstrap';
import { months } from '../../../../constants/enums';
import { injectIntl } from 'react-intl';
import { getTranslatedMonths, parseJwt } from '../../../../helpers/format';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useRef, useState } from 'react';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { InputText } from 'primereact/inputtext';
import { getCurrentUser } from '../../../../helpers/utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { listUpdate, tokenUser } from '../../../../atoms/user';
import { get, getDatabase, ref } from 'firebase/database';
import LoadingComponent from '../../../../components/loading';
import ModalConfirm from '../../../../components/modalConfirm';

function HistoricPage({ intl }) {
  const { messages } = intl;
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth].value);
  const translatedMonths = getTranslatedMonths(intl);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const isFirst = useRef(true);
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const [list, setList] = useState([]);
  const [totalExits, setTotalExits] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateList, setUpdateList] = useRecoilState(listUpdate);

  useEffect(() => {
    if (isFirst.current || updateList) {
      setIsLoading(true);

      getInfos()
        .then((res) => {
          if (res) {
            setIsLoading(false);
            delete res.image;
            const _data = res;
            const _dataFormated = [];
            let entries = 0;
            let exits = 0;

            const formatValues = (items, label, updateTotal) => {
              if (items) {
                Object.values(items).forEach((item) => {
                  updateTotal(parseFloat(item?.value));
                  _dataFormated.push({ ...item, label });
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
  }, [updateList]);

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

  return (
    <>
      <LoadingComponent isLoading={isLoading} text={messages['message.wait']} />
      <ModalConfirm isOpen={modalConfirm} setIsOpen={setModalConfirm} item={selectedItem} />
      <div className="historic-page">
        <TopNav />
        <div className="wow animate__animated animate__fadeIn">
          <div className="container-filter">
            <InputText
              className="input-form"
              placeholder="Ano"
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
              Entradas: <span className="positive">R$ {totalEntries.toFixed(2)}</span>
            </Colxx>
            <Colxx xxs={6}>
              Saídas: <span className="negative">R$ {totalExits.toFixed(2)}</span>
            </Colxx>
          </Row>
          <div className="container-historic">
            {list &&
              list.map((item) => (
                <div key={item.id} className="card">
                  <Row>
                    <Colxx xxs={8}>
                      <div>
                        <b>Tipo:</b> <span className={`label ${item.label.toLowerCase()}`}>{item.label}</span>
                      </div>
                      <div>
                        <b>Valor:</b> {item.value}
                      </div>
                      <div>
                        <b>Data:</b> {item.date}
                      </div>
                    </Colxx>
                    <Colxx xxs={4}>
                      <div className="actions-btn">
                        <Button
                          className="btn-edit"
                          onClick={() => {
                            alert('Editar!');
                          }}
                        >
                          <i className="pi pi-pencil" />
                        </Button>
                        <Button
                          className="btn-del"
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
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default injectIntl(HistoricPage);
