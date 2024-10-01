import { Button, Row } from 'reactstrap';
import { Colxx } from '../../../components/common/customBootstrap';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { route } from '../../../atoms/route';
import { injectIntl } from 'react-intl';
import ModalAddInfos from '../../../components/modalAddInfos';
import { useState } from 'react';

function Footer({ intl }) {
  const { messages } = intl;
  const navigate = useNavigate();
  const currentRoute = useRecoilValue(route);
  const [modalAddInfos, setModalAddInfos] = useState(false);

  return (
    <>
      <ModalAddInfos isOpen={modalAddInfos} setIsOpen={setModalAddInfos} />
      <footer className="wow animate__animated animate__fadeIn">
        <Row>
          <Colxx xxs={3}>
            <div className={`${currentRoute === 'home' ? 'active container-btn' : 'container-btn'}`}>
              <i
                onClick={() => {
                  navigate('/home');
                }}
                className="pi pi-home"
              />
              <div className="label">{messages['message.home']}</div>
            </div>
          </Colxx>
          <Colxx xxs={2}>
            <div className={`${currentRoute === 'historic' ? 'active container-btn' : 'container-btn'}`}>
              <i
                onClick={() => {
                  navigate('/historic');
                }}
                className="pi pi-arrow-right-arrow-left"
              />
              <div className="label">{messages['message.historic']}</div>
            </div>
          </Colxx>
          <Colxx xxs={2}>
            <Button
              onClick={() => {
                setModalAddInfos(!modalAddInfos);
              }}
            >
              <i className="pi pi-plus" />
            </Button>
          </Colxx>
          <Colxx xxs={2}>
            <div className={`${currentRoute === 'graphics' ? 'active container-btn' : 'container-btn'}`}>
              <i
                onClick={() => {
                  navigate('/graphics');
                }}
                className="pi pi-chart-pie"
              />
              <div className="label">{messages['message.graphics']}</div>
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
              <div className="label">{messages['message.settings']}</div>
            </div>
          </Colxx>
        </Row>
      </footer>
    </>
  );
}

export default injectIntl(Footer);
