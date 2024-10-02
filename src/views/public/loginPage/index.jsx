import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormGroup, Input, Label, Row } from 'reactstrap';
import { Colxx } from '../../../components/common/customBootstrap';
import { InputText } from 'primereact/inputtext';
import { auth } from '../../../services';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useIonToast } from '@ionic/react';
import { setCurrentUser } from '../../../helpers/utils';
import { tokenUser } from '../../../atoms/user';
import { useSetRecoilState } from 'recoil';
import { injectIntl } from 'react-intl';
import { validarEmail } from '../../../helpers/format';
import { currentIsLoad } from '../../../atoms/loading';

function LoginPage({ intl }) {
  const { messages } = intl;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openEye, setOpenEye] = useState(false);
  const setAccessToken = useSetRecoilState(tokenUser);
  const [toast] = useIonToast();
  const [keepSession, setKeepSession] = useState(true);
  const inputRef = useRef(null);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [emailChangePassword, setEmailChangePassword] = useState('');
  const setIsLoading = useSetRecoilState(currentIsLoad);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  function submitForm(e) {
    e.preventDefault();
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        setTimeout(() => {
          const token = res.user.accessToken;
          if (keepSession) {
            setCurrentUser(token);
          } else {
            setAccessToken(token);
          }
          clearForm();
          navigate('/home');
          setIsLoading(false);
        }, 2500);
      })
      .catch(() => {
        setTimeout(() => {
          setIsLoading(false);
          toast({
            message: messages['message.errorLogin'],
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

  function submitChangePassword(e) {
    e.preventDefault();

    if (validarEmail(emailChangePassword)) {
      setIsLoading(true);
      sendPasswordResetEmail(auth, emailChangePassword)
        .then(() => {
          setTimeout(() => {
            setIsLoading(false);
            setEmailChangePassword('');
            setIsChangePassword(false);
            toast({
              message: messages['message.sendEmailSuccess'],
              duration: 2000,
              position: 'bottom',
            });
          }, 2500);
        })
        .catch(() => {
          setTimeout(() => {
            setIsLoading(false);
            toast({
              message: messages['message.sendEmailError'],
              duration: 2000,
              position: 'bottom',
            });
          }, 2500);
        });
    } else {
      toast({
        message: messages['message.emailInvalid'],
        duration: 2000,
        position: 'bottom',
      });
    }
  }

  return (
    <>
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
          {messages['message.login']}
        </div>
        <form onSubmit={(e) => submitForm(e)} className="container-form">
          <Row>
            <Colxx xxs={12}>
              <InputText
                className="input-form w-100 mb-3 wow animate__animated animate__fadeIn"
                data-wow-delay="0.3s"
                placeholder={messages['message.email']}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={inputRef}
              />
            </Colxx>
          </Row>
          <Row>
            <Colxx xxs={11}>
              <InputText
                className="input-form w-100 wow animate__animated animate__fadeIn"
                data-wow-delay="0.4s"
                placeholder={messages['message.password']}
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
                  className={keepSession ? 'active' : ''}
                  type="switch"
                  checked={keepSession}
                  onChange={() => {
                    setKeepSession(!keepSession);
                  }}
                />
                <Label check>{messages['message.keepSession']}</Label>
              </FormGroup>
            </Colxx>
          </Row>
          <Row className="container-action">
            <Button type="submit" className="btn-confirm wow animate__animated animate__fadeIn" data-wow-delay="0.7s">
              {messages['message.access']}
            </Button>
          </Row>
          <Row>
            <Colxx xxs={12}>
              <Label
                className="remember-password wow animate__animated animate__fadeIn"
                data-wow-delay="0.7s"
                onClick={() => {
                  setIsChangePassword(!isChangePassword);
                }}
              >
                Esqueci a senha
              </Label>
            </Colxx>
          </Row>
        </form>
        {isChangePassword ? (
          <div className="container-form-remember">
            <div
              className={
                isChangePassword
                  ? 'card active wow animate__animated animate__fadeIn'
                  : 'card wow animate__animated animate__fadeIn'
              }
            >
              <form onSubmit={(e) => submitChangePassword(e)}>
                <div className="container">
                  <div className="label-container">
                    <div className="background-icon first">
                      <i className="pi pi-envelope" />
                    </div>
                    <InputText
                      required
                      className="input-form w-100"
                      placeholder={messages['message.enterYourEmail']}
                      value={emailChangePassword}
                      onChange={(e) => setEmailChangePassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="btn-send">
                    <i className="pi pi-send" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default injectIntl(LoginPage);
