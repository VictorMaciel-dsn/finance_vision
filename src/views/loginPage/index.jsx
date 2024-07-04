import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row } from 'reactstrap';
import { Colxx } from '../../components/common/customBootstrap';
import { InputText } from 'primereact/inputtext';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openEye, setOpenEye] = useState(false);

  function submitForm(e) {
    e.preventDefault();
    // Chamar API - FireBase
    alert('Logou!');
  }

  return (
    <>
      <div className="login-page">
        <div className="container-btn">
          <Button
            onClick={() => {
              navigate('/');
            }}
          >
            <i className="pi pi-angle-left" />
          </Button>
        </div>
        <div className="title">Conecte-se</div>
        <form onSubmit={(e) => submitForm(e)} className="container-form">
          <Row>
            <Colxx xxs={12}>
              <InputText
                className="input-form w-100 mb-3"
                placeholder="E-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Colxx>
          </Row>
          <Row>
            <Colxx xxs={11}>
              <InputText
                className="input-form w-100"
                placeholder="Senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={openEye ? 'text' : 'password'}
              />
            </Colxx>
            <Colxx xxs={1} className="icon-eye">
              {openEye ? (
                <i
                  className="pi pi-eye-slash"
                  onClick={() => {
                    setOpenEye(!openEye);
                  }}
                />
              ) : (
                <i
                  className="pi pi-eye"
                  onClick={() => {
                    setOpenEye(!openEye);
                  }}
                />
              )}
            </Colxx>
          </Row>
          <Row className="container-action">
            <Button type="submit" className="btn-confirm">
              Acessar
            </Button>
          </Row>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
