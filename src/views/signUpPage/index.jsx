import { Button, Row } from 'reactstrap';
import { Colxx } from '../../components/common/customBootstrap';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services';
import { IonLoading, useIonToast } from '@ionic/react';

function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [openEye, setOpenEye] = useState(false);
  const [openEyeConfirm, setOpenEyeConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast] = useIonToast();

  function submitForm(e) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast({
        message: 'As senhas não são iguais, confira!',
        duration: 2000,
        position: 'bottom',
      });
      return;
    } else if (passwordConfirm.length >= 6) {
      setIsLoading(true);

      createUserWithEmailAndPassword(auth, email, passwordConfirm)
        .then(() => {
          setTimeout(() => {
            toast({
              message: 'Usuário criado com sucesso!',
              duration: 2000,
              position: 'bottom',
            });
            setIsLoading(false);
            clearForm();
          }, 2500);
        })
        .catch(() => {
          setTimeout(() => {
            setIsLoading(false);
            toast({
              message: 'Houve um erro ao criar o usuário!',
              duration: 2000,
              position: 'bottom',
            });
          }, 2500);
        });
    } else {
      toast({
        message: 'A senha deve ter pelo menos 6 caracteres!',
        duration: 2000,
        position: 'bottom',
      });
    }
  }

  function clearForm() {
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
    setOpenEye(false);
    setOpenEyeConfirm(false);
  }

  return (
    <>
      <IonLoading isOpen={isLoading} message={'Aguarde...'} />
      <div className="signUp-page">
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
          Inscreva-se
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
                className="input-form w-100 mb-3 wow animate__animated animate__fadeIn"
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
          <Row>
            <Colxx xxs={11}>
              <InputText
                className="input-form w-100 wow animate__animated animate__fadeIn"
                data-wow-delay="0.6s"
                placeholder="Confirme a senha"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                type={openEyeConfirm ? 'text' : 'password'}
              />
            </Colxx>
            <Colxx xxs={1} className="icon-eye wow animate__animated animate__fadeIn">
              {openEyeConfirm ? (
                <i
                  className="pi pi-eye-slash"
                  onClick={() => {
                    setOpenEyeConfirm(!openEyeConfirm);
                  }}
                />
              ) : (
                <i
                  className="pi pi-eye"
                  onClick={() => {
                    setOpenEyeConfirm(!openEyeConfirm);
                  }}
                />
              )}
            </Colxx>
          </Row>
          <Row className="container-action">
            <Button type="submit" className="btn-confirm wow animate__animated animate__fadeIn" data-wow-delay="0.7s">
              Confirmar
            </Button>
          </Row>
        </form>
      </div>
    </>
  );
}

export default SignUpPage;
