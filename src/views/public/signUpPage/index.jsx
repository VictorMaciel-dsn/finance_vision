import { Button, Row } from 'reactstrap';
import { Colxx } from '../../../components/common/customBootstrap';
import { InputText } from 'primereact/inputtext';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../services';
import { useIonToast } from '@ionic/react';
import LoadingComponent from '../../../components/loading';
import { injectIntl } from 'react-intl';
import { getDatabase, push, ref, set } from 'firebase/database';

function SignUpPage({ intl }) {
  const { messages } = intl;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [openEye, setOpenEye] = useState(false);
  const [openEyeConfirm, setOpenEyeConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast] = useIonToast();
  const inputRef = useRef(null);
  const [newUser, setNewUser] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (newUser) {
      saveUser(newUser);
    }
  }, [newUser]);

  function submitForm(e) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast({
        message: messages['message.passwordNoEqual'],
        duration: 2000,
        position: 'bottom',
      });
      return;
    } else if (passwordConfirm.length >= 6) {
      setIsLoading(true);

      createUserWithEmailAndPassword(auth, email, passwordConfirm)
        .then((res) => {
          setNewUser(res.user.uid);
          setTimeout(() => {
            toast({
              message: messages['message.userCreatedSuccess'],
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
              message: messages['message.userCreatedError'],
              duration: 2000,
              position: 'bottom',
            });
          }, 2500);
        });
    } else {
      toast({
        message: messages['message.passwordSixCharacters'],
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

  function saveUser(idUser) {
    const db = getDatabase();
    const userRef = ref(db, `users/${idUser}`);

    set(userRef, '')
      .then(() => {
        console.log('Usuário salvo com sucesso!');
        setNewUser('');
      })
      .catch((error) => {
        console.log('Erro ao salvar usuário!', error);
        setNewUser('');
      });
  }

  return (
    <>
      <LoadingComponent isLoading={isLoading} text={messages['message.wait']} />
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
          {messages['message.signUp']}
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
                className="input-form w-100 mb-3 wow animate__animated animate__fadeIn"
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
          <Row>
            <Colxx xxs={11}>
              <InputText
                className="input-form w-100 wow animate__animated animate__fadeIn"
                data-wow-delay="0.6s"
                placeholder={messages['message.passwordConfirm']}
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
              {messages['message.confirm']}
            </Button>
          </Row>
        </form>
      </div>
    </>
  );
}

export default injectIntl(SignUpPage);
