import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
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

function InnerRoutes() {
  const location = useLocation();
  const theme = useRecoilValue(currentColor);
  const setCurrentRoute = useSetRecoilState(route);

  useEffect(() => {
    const routePath = location.pathname.substring(1);
    setCurrentRoute(routePath);
    // console.log(routePath);
  }, [location, setCurrentRoute]);

  return (
    <div className="main" data-theme={theme}>
      <ToastContainer theme={theme} />
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
