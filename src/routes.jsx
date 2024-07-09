import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { currentColor } from './atoms/theme';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import InitialPage from './views/public/initialPage';
import SignUpPage from './views/public/signUpPage';
import LoginPage from './views/public/loginPage';
import HistoricPage from './views/app/pages/historicPage';
import HomePage from './views/app/pages/homePage';
import ConfigPage from './views/app/pages/configPage';
import WalletPage from './views/app/pages/walletPage';
import { route } from './atoms/route';
import { useEffect } from 'react';
import { getCurrentUser } from './helpers/utils';
import { parseJwt } from './helpers/format';
import { userStorageKey } from './constants/defaultValues';
import { signOut } from 'firebase/auth';
import { auth } from './services';
import { useIonToast } from '@ionic/react';

function InnerRoutes() {
  const location = useLocation();
  const theme = useRecoilValue(currentColor);
  const setCurrentRoute = useSetRecoilState(route);
  const _userToken = getCurrentUser();
  const navigate = useNavigate();
  const [toast] = useIonToast();

  useEffect(() => {
    const routePath = location.pathname.substring(1);
    setCurrentRoute(routePath);
  }, [location, setCurrentRoute]);

  useEffect(() => {
    if (!_userToken) {
      navigate('/');
    } else {
      const _jwt = parseJwt(_userToken);
      const _exp = new Date(_jwt.exp * 1000);
      const currentTime = new Date();
      const timeUntilExpiration = _exp - currentTime;

      if (timeUntilExpiration <= 0) {
        logout();
      } else {
        const timeoutId = setTimeout(() => {
          logout();
        }, timeUntilExpiration);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [_userToken]);

  function logout() {
    signOut(auth)
      .then(() => {
        navigate('/');
        localStorage.removeItem(userStorageKey);
        toast({
          message: 'Sessão expirada, realize novamente o login!',
          duration: 2000,
          position: 'bottom',
        });
      })
      .catch(() => {
        toast({
          message: 'Houve um erro ao se desconectar!',
          duration: 2000,
          position: 'bottom',
        });
      });
  }

  return (
    <div className="main" data-theme={theme}>
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/historic" element={<HistoricPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/wallet" element={<WalletPage />} />
      </Routes>
    </div>
  );
}

function AppRoutes() {
  return (
    <Router>
      <InnerRoutes />
    </Router>
  );
}

export default AppRoutes;
