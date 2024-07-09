import { Avatar } from 'primereact/avatar';
import profileImage from '../../../assets/img/foto-perfil.jpeg';
import { greetingsLabels } from '../../../helpers/format';
import { useRecoilValue } from 'recoil';
import { route } from '../../../atoms/route';
import { useEffect, useState } from 'react';

function TopNav() {
  const greetingsLabel = greetingsLabels();
  const currentRoute = useRecoilValue(route);
  const [componentLabel, setComponentLabel] = useState('');
  const [classIcon, setClassIcon] = useState('');

  useEffect(() => {
    if (currentRoute === 'historic') {
      setComponentLabel('Histórico');
      setClassIcon('pi-chart-bar');
    } else if (currentRoute === 'home') {
      setComponentLabel('Início');
      setClassIcon('pi-home');
    } else if (currentRoute === 'wallet') {
      setComponentLabel('Carteira');
      setClassIcon('pi-wallet');
    } else if (currentRoute === 'config') {
      setComponentLabel('Configurações');
      setClassIcon('pi-cog');
    }
  }, [currentRoute]);

  return (
    <>
      <div className="container-topnav wow animate__animated animate__fadeIn">
        <div className="label">
          <div className="user-label">{greetingsLabel} Victor!</div>
          <div className='icon-label'>
            <i className={`pi ${classIcon}`} /> <h3>{componentLabel}</h3>
          </div>
        </div>
        <div>
          <Avatar image={profileImage} size="xlarge" shape="circle" />
        </div>
      </div>
    </>
  );
}

export default TopNav;
