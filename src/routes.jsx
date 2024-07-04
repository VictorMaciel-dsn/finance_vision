import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { currentColor } from './atoms/theme';
import { useRecoilValue } from 'recoil';
import InitialPage from './views/initialPage/index';
import SignUpPage from './views/signUpPage';
import LoginPage from './views/loginPage';
// import HomePage from './views/app/home/index';

function AppRoutes() {
  const theme = useRecoilValue(currentColor);

  return (
    <div className="main" data-theme={theme}>
      <ToastContainer theme={theme} />
      <Router>
        <Routes>
          <Route path="/" element={<InitialPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/home" element={<HomePage />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default AppRoutes;
