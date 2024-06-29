import './theme/variables.css';
import { setupIonicReact } from '@ionic/react';
import AppRoutes from './routes';

setupIonicReact();

const App = () => {
  return <AppRoutes />;
};

export default App;
