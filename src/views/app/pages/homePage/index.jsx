import { Card, CardBody, CardHeader, Row } from 'reactstrap';
import Footer from '../../footer';
import TopNav from '../../topnav';
import { Colxx } from '../../../../components/common/customBootstrap';
import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { months } from '../../../../constants/enums';

function HomePage() {
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth].value);

  return (
    <>
      <div className="home-page">
        <TopNav />
        <div className="container-home">
          <div className="container-filter mb-2">
            <Dropdown
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.value)}
              options={months}
              optionLabel="label"
              optionValue="value"
              placeholder="Selecione um mês"
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
                  <div>Saldo total</div>
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
                  <div>Entradas</div>
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
                  <div>A pagar</div>
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
                  <div>Investidos</div>
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
                  <div>Pago</div>
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
                    <i className="pi pi-credit-card" /> Meus <strong>cartões</strong>
                  </div>
                  <div
                    className="custom-btn"
                    onClick={() => {
                      alert('Adicionar cartão!');
                    }}
                  >
                    <i className="pi pi-plus" /> Adicionar
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="no-data">
                    <i className="pi pi-exclamation-circle" /> Nenhum cartão cadastrado!
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
                    <i className="pi pi-wallet" /> Minhas <strong>contas</strong>
                  </div>
                  <div
                    className="custom-btn"
                    onClick={() => {
                      alert('Adicionar conta!');
                    }}
                  >
                    <i className="pi pi-plus" /> Adicionar
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="no-data">
                    <i className="pi pi-exclamation-circle" /> Nenhuma conta cadastrada!
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

export default HomePage;
