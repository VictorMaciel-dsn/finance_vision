import { Button, Row } from 'reactstrap';
import { Colxx } from '../../../components/common/customBootstrap';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { route } from '../../../atoms/route';

function Footer() {
  const navigate = useNavigate();
  const currentRoute = useRecoilValue(route);

  return (
    <>
      <footer>
        <Row>
          <Colxx xxs={3}>
            <div className={`${currentRoute === 'home' ? 'active container-btn' : 'container-btn'}`}>
              <i
                onClick={() => {
                  navigate('/home');
                }}
                className="pi pi-home"
              />
              <div className="label">Início</div>
            </div>
          </Colxx>
          <Colxx xxs={2}>
            <div className={`${currentRoute === 'wallet' ? 'active container-btn' : 'container-btn'}`}>
              <i
                onClick={() => {
                  navigate('/wallet');
                }}
                className="pi pi-wallet"
              />
              <div className="label">Carteira</div>
            </div>
          </Colxx>
          <Colxx xxs={2}>
            <Button>
              <i
                onClick={() => {
                  alert('Add!');
                }}
                className="pi pi-plus"
              />
            </Button>
          </Colxx>
          <Colxx xxs={2}>
            <div className={`${currentRoute === 'historic' ? 'active container-btn' : 'container-btn'}`}>
              <i
                onClick={() => {
                  navigate('/historic');
                }}
                className="pi pi-chart-bar"
              />
              <div className="label">Histórico</div>
            </div>
          </Colxx>
          <Colxx xxs={3}>
            <div className={`${currentRoute === 'config' ? 'active container-btn' : 'container-btn'}`}>
              <i
                onClick={() => {
                  navigate('/config');
                }}
                className="pi pi-cog"
              />
              <div className="label">Configurações</div>
            </div>
          </Colxx>
        </Row>
      </footer>
    </>
  );
}

export default Footer;
