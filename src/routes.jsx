import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { currentColor } from './atoms/theme';
import { useRecoilValue } from 'recoil';
import LoginPage from './views/login/index'
import HomePage from './views/app/home/index'

function AppRoutes() {
  const theme = useRecoilValue(currentColor);

  return (
    <div className="main" data-theme={theme}>
      <ToastContainer theme={theme} />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default AppRoutes;
