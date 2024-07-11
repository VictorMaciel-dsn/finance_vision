import './theme/variables.css';
import { setupIonicReact } from '@ionic/react';
import AppRoutes from './routes';
import { useEffect } from 'react';
import WOW from 'wow.js';
import { appFirebase } from './services';
import { useRecoilValue } from 'recoil';
import AppLocale from './lang';
import { currentLanguage } from './atoms/lang';
import { IntlProvider } from 'react-intl';

setupIonicReact();

const App = () => {
  const locale = useRecoilValue(currentLanguage);
  const currentAppLocale = AppLocale[locale];

  useEffect(() => {
    const wow = new WOW();
    wow.init();
    appFirebase;
  }, []);

  return (
    <>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
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
};

export default App;
