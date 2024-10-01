import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { currentColor } from './atoms/theme';
import { useRecoilState, useSetRecoilState } from 'recoil';
import InitialPage from './views/public/initialPage';
import SignUpPage from './views/public/signUpPage';
import LoginPage from './views/public/loginPage';
import HistoricPage from './views/app/pages/historicPage';
import HomePage from './views/app/pages/homePage';
import GraphicsPage from './views/app/pages/graphicsPage';
import ConfigPage from './views/app/pages/configPage';
import { route } from './atoms/route';
import { useEffect } from 'react';
import { getCurrentTheme, getCurrentUser } from './helpers/utils';
import { parseJwt } from './helpers/format';
import { langStorageKey, themeStorageKey, userStorageKey } from './constants/defaultValues';
import { signOut } from 'firebase/auth';
import { auth } from './services';
import { useIonToast } from '@ionic/react';
import { injectIntl } from 'react-intl';
import { currentLanguage } from './atoms/lang';

function InnerRoutes({ intl }) {
  const { messages } = intl;
  const location = useLocation();
  const [theme, setTheme] = useRecoilState(currentColor);
  const setCurrentRoute = useSetRecoilState(route);
  const _userToken = getCurrentUser();
  const navigate = useNavigate();
  const [toast] = useIonToast();
  const currentTheme = getCurrentTheme();
  const setLang = useSetRecoilState(currentLanguage);

  useEffect(() => {
    if (currentTheme === 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [currentTheme]);

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
        localStorage.removeItem(langStorageKey);
        localStorage.removeItem(themeStorageKey);
        setLang('pt-br');
        toast({
          message: messages['message.sessionExpired'],
          duration: 2000,
          position: 'bottom',
        });
      })
      .catch(() => {
        toast({
          message: messages['message.disconnectError'],
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
        <Route path="/graphics" element={<GraphicsPage />} />
      </Routes>
    </div>
  );
}

function AppRoutes({ intl }) {
  return (
    <Router>
      <InnerRoutes intl={intl} />
    </Router>
  );
}

export default injectIntl(AppRoutes);
