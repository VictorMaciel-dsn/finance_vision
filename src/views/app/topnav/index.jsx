import { Avatar } from 'primereact/avatar';
import { useRecoilValue } from 'recoil';
import { route } from '../../../atoms/route';
import { useEffect, useRef, useState } from 'react';
import { injectIntl } from 'react-intl';
import { currentLanguage } from '../../../atoms/lang';
import { get, getDatabase, ref } from 'firebase/database';
import defaultProfileImage from '../../../assets/img/profile-image.jpg';
import { updateImageUser } from '../../../atoms/user';

function TopNav({ intl }) {
  const { messages } = intl;
  const greetingsLabel = greetingsLabels();
  const currentRoute = useRecoilValue(route);
  const [componentLabel, setComponentLabel] = useState('');
  const [classIcon, setClassIcon] = useState('');
  const lang = useRecoilValue(currentLanguage);
  const [profileImage, setProfileImage] = useState('');
  const isFirst = useRef(true);
  const isUpdateImage = useRecoilValue(updateImageUser);

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

  useEffect(() => {
    if (isFirst.current || isUpdateImage) {
      getImage()
        .then((res) => {
          if (res !== null) {
            setProfileImage(res.img);
          }
        })
        .catch((error) => {
          console.error('Erro ao obter a imagem:', error);
        });
      isFirst.current = false;
    }
  }, [isUpdateImage]);

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

  async function getImage() {
    const db = getDatabase();
    const dataRef = ref(db, 'images');

    try {
      const res = await get(dataRef);
      return res.val();
    } catch {
      return null;
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
          <Avatar image={profileImage ? profileImage : defaultProfileImage} size="xlarge" shape="circle" />
        </div>
      </div>
    </>
  );
}

export default injectIntl(TopNav);
