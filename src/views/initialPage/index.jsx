import { Button } from 'reactstrap';
import imgLogo from '../../assets/img/icon.png';
import { useNavigate } from 'react-router-dom';

function InitialPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="inital-page">
        <div className="container-img">
          <img src={imgLogo} alt="logo" />
          <div className="title-app">Bem-vindo ao Finance Vision!</div>
          <div className="subtitle-app">
            Sua vida financeira organizada <i className="pi pi-chart-bar" />
          </div>
        </div>
        <div className="container-btns">
          <Button
            className="btn-signUp"
            onClick={() => {
              navigate('/signUp');
            }}
          >
            Inscreva-se
          </Button>
          <Button
            className="btn-login"
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
