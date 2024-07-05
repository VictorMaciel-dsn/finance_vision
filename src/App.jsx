import './theme/variables.css';
import { setupIonicReact } from '@ionic/react';
import AppRoutes from './routes';
import { useEffect } from 'react';
import WOW from 'wow.js';
import { appFirebase } from './services';

setupIonicReact();

const App = () => {
  useEffect(() => {
    const wow = new WOW();
    wow.init();
    appFirebase;
  }, []);

  return <AppRoutes />;
};

export default App;
