import { Button, Row } from 'reactstrap';
import Footer from '../../footer';
import TopNav from '../../topnav';
import { Colxx } from '../../../../components/common/customBootstrap';
import { _dataHistoric, months } from '../../../../constants/enums';
import { injectIntl } from 'react-intl';
import { getTranslatedMonths } from '../../../../helpers/format';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { InputText } from 'primereact/inputtext';

function HistoricPage({ intl }) {
  const { messages } = intl;
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth].value);
  const translatedMonths = getTranslatedMonths(intl);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  return (
    <>
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
              Entradas: <span className="positive">R$ 2.000,00</span>
            </Colxx>
            <Colxx xxs={6}>
              Saídas: <span className="negative">R$ 850,00</span>
            </Colxx>
          </Row>
          <div className="container-historic">
            {_dataHistoric.map((item) => (
              <div key={item.id} className="card">
                <Row>
                  <Colxx xxs={8}>
                    <div>
                      <b>Tipo:</b> {item.label}
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
                          alert('Excluir!');
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
