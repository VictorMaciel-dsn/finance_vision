import Footer from '../../footer';
import TopNav from '../../topnav';
import profileImage from '../../../../assets/img/foto-perfil.jpeg';
import { useRecoilValue } from 'recoil';
import { tokenUser } from '../../../../atoms/user';
import { useEffect, useState } from 'react';
import { parseJwt } from '../../../../helpers/format';
import { Button } from 'reactstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../../../../services';
import { useNavigate } from 'react-router-dom';

function ConfigPage() {
  const navigate = useNavigate();
  const _userToken = useRecoilValue(tokenUser);
  const [emailUser, setEmailUser] = useState('');

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

        <div className="container-configs">
          <label>Preferências</label>
          <div className="card">Alterar idioma</div>
          <div className="card">Alterar tema</div>
        </div>

        <div className="container-configs">
          <label>Conta</label>
          <div className="card">Alterar imagem</div>
          <div className="card">Alterar e-mail</div>
          <div className="card">Alterar senha</div>
        </div>

        <div className="container-btn">
          <Button
            onClick={() => {
              logout();
            }}
          >
            <i className="pi pi-sign-out" /> Sair
          </Button>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default ConfigPage;
