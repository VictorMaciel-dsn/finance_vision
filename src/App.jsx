import './theme/variables.css';
import { setupIonicReact } from '@ionic/react';
import AppRoutes from './routes';
import { useEffect, useState } from 'react';
import WOW from 'wow.js';
import { appFirebase } from './services';
import { useRecoilValue } from 'recoil';
import AppLocale from './lang';
import { currentLanguage } from './atoms/lang';
import { IntlProvider } from 'react-intl';
import imgLogo from './assets/img/icon.png';

setupIonicReact();

const App = () => {
  const locale = useRecoilValue(currentLanguage);
  const currentAppLocale = AppLocale[locale];
  const [noVisibleApp, setNoVisibleApp] = useState(false);

  function isVerifyApp() {
    if (window.innerWidth >= 770 && window.innerHeight >= 650) {
      setNoVisibleApp(true);
    }
  }

  useEffect(() => {
    const wow = new WOW();
    wow.init();
    appFirebase;
    isVerifyApp();
  }, []);

  if (noVisibleApp) {
    return (
      <div className="no-visible-app">
        <div className="no-visible-img">
          <img src={imgLogo} alt="logo" className="wow animate__animated animate__fadeInDown" />
        </div>
        <div className="no-visible-info">
          <i className="pi pi-exclamation-triangle"></i>
          <p>Aplicação não recomendada para dispositivos maiores que tablets!</p>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <IntlProvider
          locale={currentAppLocale?.locale}
          messages={currentAppLocale?.messages}
          onError={(err) => {
            if (err.code === 'MISSING_TRANSLATION') {
              return;
            }
            throw err;
          }}
        >
          <AppRoutes />
        </IntlProvider>
      </>
    );
  }
};

export default App;
