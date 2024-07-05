import { Button } from 'reactstrap';
import imgLogo from '../../assets/img/icon.png';
import { useNavigate } from 'react-router-dom';

function InitialPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="inital-page">
        <div className="container-img">
          <img src={imgLogo} alt="logo" className="wow animate__animated animate__fadeInDown" />
          <div className="title-app wow animate__animated animate__fadeIn" data-wow-delay="0.2s">
            Bem-vindo ao Finance Vision!
          </div>
          <div className="subtitle-app wow animate__animated animate__fadeIn" data-wow-delay="0.3s">
            Sua vida financeira organizada <i className="pi pi-chart-bar" />
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
            Inscreva-se
          </Button>
          <Button
            className="btn-login wow animate__animated animate__fadeIn"
            data-wow-delay="0.5s"
            onClick={() => {
              navigate('/login');
            }}
          >
            Conecte-se
          </Button>
        </div>
      </div>
    </>
  );
}

export default InitialPage;
