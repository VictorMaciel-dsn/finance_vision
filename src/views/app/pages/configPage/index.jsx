import Footer from '../../footer';
import TopNav from '../../topnav';
import profileImage from '../../../../assets/img/foto-perfil.jpeg';
import { useRecoilValue } from 'recoil';
import { tokenUser } from '../../../../atoms/user';
import { useEffect, useState } from 'react';
import { parseJwt } from '../../../../helpers/format';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../../../../services';
import { useNavigate } from 'react-router-dom';
import ptBrImage from '../../../../assets/img/pt-br.png';
import enUsImage from '../../../../assets/img/en-us.png';

function ConfigPage() {
  const navigate = useNavigate();
  const _userToken = useRecoilValue(tokenUser);
  const [emailUser, setEmailUser] = useState('');
  const [isLang, setIsLang] = useState(false);
  const [ptBr, setPtBr] = useState(true);
  const [enUs, setEnUs] = useState(false);
  const [theme, setTheme] = useState(false);

  useEffect(() => {
    if (_userToken) {
      let token = parseJwt(_userToken);
      setEmailUser(token.email);
    }
  }, [_userToken]);

  function logout() {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        //toast.error("Houve um erro ao se desconectar!");
        alert('Houve um erro ao se desconectar!');
      });
  }

  return (
    <>
      <div className="config-page">
        <TopNav />
        <div className="screen">
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
            <div className="card">
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
              <div className="card">
                <FormGroup switch>
                  <Input
                    type="switch"
                    checked={ptBr}
                    onClick={() => {
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
                    type="switch"
                    checked={enUs}
                    onClick={() => {
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
                    type="switch"
                    checked={theme}
                    onClick={() => {
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
            <div className="card">
              <div className="container">
                <div className="label-container">
                  <div className="background-icon first">
                    <i className="pi pi-key" />
                  </div>
                  <div className="text">Alterar senha</div>
                </div>
                <div className="background-icon">
                  <i
                    className="pi pi-pencil"
                    onClick={() => {
                      alert('Alterar senha!');
                    }}
                  />
                </div>
              </div>
            </div>
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
