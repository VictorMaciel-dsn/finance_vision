import { Button } from 'reactstrap';
import imgLogo from '../../../assets/img/icon.png';
import { useNavigate } from 'react-router-dom';
import { injectIntl } from 'react-intl';

function InitialPage({ intl }) {
  const { messages } = intl;
  const navigate = useNavigate();

  return (
    <>
      <div className="inital-page">
        <div className="container-img">
          <img src={imgLogo} alt="logo" className="wow animate__animated animate__fadeInDown" />
          <div className="title-app wow animate__animated animate__fadeIn" data-wow-delay="0.2s">
            {messages['message.welcomeApp']}
          </div>
          <div className="subtitle-app wow animate__animated animate__fadeIn" data-wow-delay="0.3s">
            {messages['message.subtitle']} <i className="pi pi-chart-bar" />
          </div>
        </div>
        <div className="container-btns">
          <Button
            className="btn-signUp wow animate__animated animate__fadeIn"
            data-wow-delay="0.4s"
            onClick={() => {
              navigate('/signUp');
            }}
          >
            {messages['message.signUp']}
          </Button>
          <Button
            className="btn-login wow animate__animated animate__fadeIn"
            data-wow-delay="0.5s"
            onClick={() => {
              navigate('/login');
            }}
          >
            {messages['message.login']}
          </Button>
        </div>
      </div>
    </>
  );
}

export default injectIntl(InitialPage);
