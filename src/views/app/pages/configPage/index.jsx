import Footer from '../../footer';
import TopNav from '../../topnav';
import profileImage from '../../../../assets/img/foto-perfil.jpeg';
import { useEffect, useState } from 'react';
import { parseJwt, validarEmail } from '../../../../helpers/format';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth } from '../../../../services';
import { useNavigate } from 'react-router-dom';
import ptBrImage from '../../../../assets/img/pt-br.png';
import enUsImage from '../../../../assets/img/en-us.png';
import { getCurrentUser } from '../../../../helpers/utils';
import { useRecoilValue } from 'recoil';
import { tokenUser } from '../../../../atoms/user';
import { userStorageKey } from '../../../../constants/defaultValues';
import { useIonToast } from '@ionic/react';
import { InputText } from 'primereact/inputtext';
import LoadingComponent from '../../../../components/loading';

function ConfigPage() {
  const navigate = useNavigate();
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const [emailUser, setEmailUser] = useState('');
  const [isLang, setIsLang] = useState(false);
  const [ptBr, setPtBr] = useState(true);
  const [enUs, setEnUs] = useState(false);
  const [theme, setTheme] = useState(false);
  const [toast] = useIonToast();
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [emailChangePassword, setEmailChangePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (_userToken) {
      let token = parseJwt(_userToken);
      setEmailUser(token.email);
    } else {
      let token = parseJwt(userToken);
      setEmailUser(token.email);
    }
  }, [_userToken]);

  function logout() {
    signOut(auth)
      .then(() => {
        navigate('/');
        localStorage.removeItem(userStorageKey);
      })
      .catch(() => {
        toast({
          message: 'Houve um erro ao se desconectar!',
          duration: 2000,
          position: 'bottom',
        });
      });
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
              message: 'E-mail enviado com sucesso, verifique!',
              duration: 2000,
              position: 'bottom',
            });
          }, 2500);
        })
        .catch(() => {
          setTimeout(() => {
            setIsLoading(false);
            toast({
              message: 'Houve um erro ao enviar o e-mail!',
              duration: 2000,
              position: 'bottom',
            });
          }, 2500);
        });
    } else {
      toast({
        message: 'E-mail inválido, verifique!',
        duration: 2000,
        position: 'bottom',
      });
    }
  }

  return (
    <>
      <LoadingComponent isLoading={isLoading} text={'Aguarde...'} />
      <div className="config-page">
        <TopNav />
        <div className="screen wow animate__animated animate__fadeIn">
          <div className="container-img">
            <img src={profileImage} alt="img-user" />
            <label>
              {emailUser ? (
                emailUser
              ) : (
                <>
                  E-mail não encontrado! <i className="pi pi-exclamation-circle" />
                </>
              )}
            </label>
          </div>

          <div className="container-configs mt-3">
            <label>Preferências</label>
            <div className={isLang ? 'card active' : 'card'}>
              <div className="container">
                <div className="label-container">
                  <div className="background-icon first">
                    <i className="pi pi-language" />
                  </div>
                  <div className="text">Alterar idioma</div>
                </div>
                <div className="background-icon">
                  <i
                    className={isLang ? 'pi pi-angle-up' : 'pi pi-angle-down'}
                    onClick={() => {
                      setIsLang(!isLang);
                    }}
                  />
                </div>
              </div>
            </div>
            {isLang ? (
              <div
                className={
                  isLang
                    ? 'card active wow animate__animated animate__fadeIn'
                    : 'card wow animate__animated animate__fadeIn'
                }
              >
                <FormGroup switch>
                  <Input
                    className={ptBr ? 'active' : ''}
                    type="switch"
                    checked={ptBr}
                    onChange={() => {
                      setPtBr(!ptBr);
                      setEnUs(!enUs);
                    }}
                  />
                  <Label check>
                    <img src={ptBrImage} /> Português
                  </Label>
                </FormGroup>
                <FormGroup switch>
                  <Input
                    className={enUs ? 'active' : ''}
                    type="switch"
                    checked={enUs}
                    onChange={() => {
                      setEnUs(!enUs);
                      setPtBr(!ptBr);
                    }}
                  />
                  <Label check>
                    <img src={enUsImage} /> Inglês
                  </Label>
                </FormGroup>
              </div>
            ) : (
              <></>
            )}
            <div className="card">
              <div className="container">
                <div className="label-container">
                  <div className="background-icon first">
                    <i className="pi pi-sun" />
                  </div>
                  <div className="text">Tema claro</div>
                </div>
                <FormGroup switch>
                  <Input
                    className={theme ? 'active' : ''}
                    type="switch"
                    checked={theme}
                    onChange={() => {
                      setTheme(!theme);
                      alert('Alterar tema!');
                    }}
                  />
                </FormGroup>
              </div>
            </div>
          </div>

          <div className="container-configs mt-3">
            <label>Conta</label>
            <div className="card">
              <div className="container">
                <div className="label-container">
                  <div className="background-icon first">
                    <i className="pi pi-image" />
                  </div>
                  <div className="text">Alterar imagem</div>
                </div>
                <div className="background-icon">
                  <i
                    className="pi pi-pencil"
                    onClick={() => {
                      alert('Alterar imagem!');
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="container">
                <div className="label-container">
                  <div className="background-icon first">
                    <i className="pi pi-envelope" />
                  </div>
                  <div className="text">Alterar e-mail</div>
                </div>
                <div className="background-icon">
                  <i
                    className="pi pi-pencil"
                    onClick={() => {
                      alert('Alterar e-mail!');
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={isChangePassword ? 'card active' : 'card'}>
              <div className="container">
                <div className="label-container">
                  <div className="background-icon first">
                    <i className="pi pi-key" />
                  </div>
                  <div className="text">Alterar senha</div>
                </div>
                <div className="background-icon">
                  <i
                    className={isChangePassword ? 'pi pi-angle-up' : 'pi pi-pencil'}
                    onClick={() => {
                      setIsChangePassword(!isChangePassword);
                    }}
                  />
                </div>
              </div>
            </div>
            {isChangePassword ? (
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
                        placeholder="Informe seu e-mail!"
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
            ) : (
              <></>
            )}
          </div>
          <div className="container-btn">
            <Button
              className={isLang ? 'mt-3' : 'mt-5'}
              onClick={() => {
                logout();
              }}
            >
              <i className="pi pi-sign-out" /> Sair
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ConfigPage;
