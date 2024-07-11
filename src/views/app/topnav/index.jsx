import { Avatar } from 'primereact/avatar';
import profileImage from '../../../assets/img/foto-perfil.jpeg';
import { greetingsLabels } from '../../../helpers/format';
import { useRecoilValue } from 'recoil';
import { route } from '../../../atoms/route';
import { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';

function TopNav({ intl }) {
  const { messages } = intl;
  const greetingsLabel = greetingsLabels();
  const currentRoute = useRecoilValue(route);
  const [componentLabel, setComponentLabel] = useState('');
  const [classIcon, setClassIcon] = useState('');

  useEffect(() => {
    if (currentRoute === 'historic') {
      setComponentLabel(messages['message.historic']);
      setClassIcon('pi-chart-bar');
    } else if (currentRoute === 'home') {
      setComponentLabel(messages['message.home']);
      setClassIcon('pi-home');
    } else if (currentRoute === 'wallet') {
      setComponentLabel(messages['message.wallet']);
      setClassIcon('pi-wallet');
    } else if (currentRoute === 'config') {
      setComponentLabel(messages['message.settings']);
      setClassIcon('pi-cog');
    }
  }, [currentRoute]);

  return (
    <>
      <div className="container-topnav wow animate__animated animate__fadeIn">
        <div className="label">
          <div className="user-label">{greetingsLabel} Victor!</div>
          <div className="icon-label">
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

export default injectIntl(TopNav);
