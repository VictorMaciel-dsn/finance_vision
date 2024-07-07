import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormGroup, Input, Label, Row } from 'reactstrap';
import { Colxx } from '../../../components/common/customBootstrap';
import { InputText } from 'primereact/inputtext';
import { auth } from '../../../services';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { IonLoading, useIonToast } from '@ionic/react';
import { setCurrentUser } from '../../../helpers/utils';
import { tokenUser } from '../../../atoms/user';
import { useSetRecoilState } from 'recoil';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openEye, setOpenEye] = useState(false);
  const setAccessToken = useSetRecoilState(tokenUser);
  const [isLoading, setIsLoading] = useState(false);
  const [toast] = useIonToast();
  const [keepSession, setKeepSession] = useState(true);

  function submitForm(e) {
    e.preventDefault();
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        setTimeout(() => {
          const token = res.user.accessToken;
          if (keepSession) {
            setCurrentUser(token);
          }
          setAccessToken(token);
          clearForm();
          navigate('/historic');
          setIsLoading(false);
        }, 2500);
      })
      .catch(() => {
        setTimeout(() => {
          setIsLoading(false);
          toast({
            message: 'Houve um erro ao realizar o login!',
            duration: 2000,
            position: 'bottom',
          });
        }, 2500);
      });
  }

  function clearForm() {
    setEmail('');
    setPassword('');
    setOpenEye(false);
  }

  return (
    <>
      <IonLoading isOpen={isLoading} message={'Entrando...'} />
      <div className="login-page">
        <div className="container-btn">
          <Button
            className="wow animate__animated animate__fadeIn"
            onClick={() => {
              navigate('/');
              clearForm();
            }}
          >
            <i className="pi pi-angle-left" />
          </Button>
        </div>
        <div className="title wow animate__animated animate__fadeIn" data-wow-delay="0.2s">
          Conecte-se
        </div>
        <form onSubmit={(e) => submitForm(e)} className="container-form">
          <Row>
            <Colxx xxs={12}>
              <InputText
                className="input-form w-100 mb-3 wow animate__animated animate__fadeIn"
                data-wow-delay="0.3s"
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
                className="input-form w-100 wow animate__animated animate__fadeIn"
                data-wow-delay="0.4s"
                placeholder="Senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={openEye ? 'text' : 'password'}
              />
            </Colxx>
            <Colxx xxs={1} className="icon-eye wow animate__animated animate__fadeIn" data-wow-delay="0.5s">
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
          <Row className="container-keepSession wow animate__animated animate__fadeIn" data-wow-delay="0.6s">
            <Colxx xxs={12}>
              <FormGroup switch>
                <Input
                  type="switch"
                  checked={keepSession}
                  onClick={() => {
                    setKeepSession(!keepSession);
                  }}
                />
                <Label check>Manter sessão</Label>
              </FormGroup>
            </Colxx>
          </Row>
          <Row className="container-action">
            <Button type="submit" className="btn-confirm wow animate__animated animate__fadeIn" data-wow-delay="0.7s">
              Acessar
            </Button>
          </Row>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
