import { Card, CardBody, CardHeader, Row } from 'reactstrap';
import Footer from '../../footer';
import TopNav from '../../topnav';
import { Colxx } from '../../../../components/common/customBootstrap';
import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { months } from '../../../../constants/enums';
import { injectIntl } from 'react-intl';
import { getTranslatedMonths } from '../../../../helpers/format';
import ModalAddCard from '../../../../components/modalAddCards';
import ModalAddAccounts from '../../../../components/modalAddAccounts';

function HomePage({ intl }) {
  const { messages } = intl;
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth].value);
  const translatedMonths = getTranslatedMonths(intl);
  const [modalAddCards, setModalAddCards] = useState(false);
  const [modalAddAccounts, setModalAddAccounts] = useState(false);

  return (
    <>
      <ModalAddCard isOpen={modalAddCards} setIsOpen={setModalAddCards} />
      <ModalAddAccounts isOpen={modalAddAccounts} setIsOpen={setModalAddAccounts} />
      <div className="home-page">
        <TopNav />
        <div className="container-home wow animate__animated animate__fadeIn">
          <div className="container-filter mb-2">
            <Dropdown
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.value)}
              options={translatedMonths}
              optionLabel="label"
              optionValue="value"
              placeholder={messages['message.selectMonth']}
              appendTo={document.getElementsByClassName('main')[0]}
            />
          </div>
          <Row className="mb-2">
            <Colxx xxs={12}>
              <Card className="custom-card">
                <div className="custom-item">
                  <i className="positive pi pi-money-bill" />
                </div>
                <div>
                  <div>{messages['message.totalBalance']}</div>
                  <strong>R$ 10.000,00</strong>
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
                  <strong>R$ 5.500,00</strong>
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
                  <strong>R$ 500,00</strong>
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
                  <div>{messages['message.investees']}</div>
                  <strong>R$ 1.500,00</strong>
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
                  <strong>R$ 2.000,00</strong>
                </div>
              </Card>
            </Colxx>
          </Row>
          <Row className="mb-2">
            <Colxx xxs={12}>
              <Card className="card-credit">
                <CardHeader>
                  <div>
                    <i className="pi pi-credit-card" /> {messages['message.myCards']}
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
                  <div className="no-data">
                    <i className="pi pi-exclamation-circle" /> {messages['message.noCardRegistered']}
                  </div>
                </CardBody>
              </Card>
            </Colxx>
          </Row>
          <Row className="mb-2">
            <Colxx xxs={12}>
              <Card className="card-credit">
                <CardHeader>
                  <div>
                    <i className="pi pi-wallet" /> {messages['message.myAccounts']}
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
                  <div className="no-data">
                    <i className="pi pi-exclamation-circle" /> {messages['message.noCardRegistered']}
                  </div>
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
