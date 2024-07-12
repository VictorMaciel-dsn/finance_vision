import { Avatar } from 'primereact/avatar';
import profileImage from '../../../assets/img/foto-perfil.jpeg';
import { useRecoilValue } from 'recoil';
import { route } from '../../../atoms/route';
import { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { currentLanguage } from '../../../atoms/lang';

function TopNav({ intl }) {
  const { messages } = intl;
  const greetingsLabel = greetingsLabels();
  const currentRoute = useRecoilValue(route);
  const [componentLabel, setComponentLabel] = useState('');
  const [classIcon, setClassIcon] = useState('');
  const lang = useRecoilValue(currentLanguage);

  useEffect(() => {
    if (currentRoute === 'historic') {
      const _msg = messages['message.historic'];
      setComponentLabel(_msg);
      setClassIcon('pi-chart-bar');
    } else if (currentRoute === 'home') {
      const _msg = messages['message.home'];
      setComponentLabel(_msg);
      setClassIcon('pi-home');
    } else if (currentRoute === 'wallet') {
      const _msg = messages['message.wallet'];
      setComponentLabel(_msg);
      setClassIcon('pi-wallet');
    } else if (currentRoute === 'config') {
      const _msg = messages['message.settings'];
      setComponentLabel(_msg);
      setClassIcon('pi-cog');
    }
  }, [currentRoute, lang]);

  function greetingsLabels() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 6 && hour < 12) {
      return messages['message.goodMorning'];
    } else if (hour >= 12 && hour < 18) {
      return messages['message.goodAfternoon'];
    } else {
      return messages['message.goodNight'];
    }
  }

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
