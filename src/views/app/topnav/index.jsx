import { Avatar } from 'primereact/avatar';
import { useRecoilValue } from 'recoil';
import { route } from '../../../atoms/route';
import { useEffect, useRef, useState } from 'react';
import { injectIntl } from 'react-intl';
import { currentLanguage } from '../../../atoms/lang';
import { get, getDatabase, ref } from 'firebase/database';
import defaultProfileImage from '../../../assets/img/profile-image.jpg';
import { tokenUser, updateImageUser } from '../../../atoms/user';
import PanelChat from '../../../components/panelChat';
import { parseJwt } from '../../../helpers/format';
import { getCurrentUser } from '../../../helpers/utils';

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
  const opNotify = useRef(null);
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (currentRoute === 'historic') {
      const _msg = messages['message.historic'];
      setComponentLabel(_msg);
      setClassIcon('pi-arrow-right-arrow-left');
    } else if (currentRoute === 'home') {
      const _msg = messages['message.home'];
      setComponentLabel(_msg);
      setClassIcon('pi-home');
    } else if (currentRoute === 'graphics') {
      const _msg = messages['message.graphics'];
      setComponentLabel(_msg);
      setClassIcon('pi-chart-pie');
    } else if (currentRoute === 'config') {
      const _msg = messages['message.settings'];
      setComponentLabel(_msg);
      setClassIcon('pi-cog');
    }
  }, [currentRoute, lang]);

  useEffect(() => {
    if (isFirst.current || isUpdateImage) {
      getInfos()
        .then((res) => {
          if (res) {
            setProfileImage(res?.image?.img);
            setUserName(res?.userName);
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

  async function getInfos() {
    const db = getDatabase();
    const user = userToken || _userToken;
    const userId = parseJwt(user).user_id;

    if (userId) {
      const dataRef = ref(db, `users/${userId}`);
      try {
        const res = await get(dataRef);
        return res.val();
      } catch {
        return null;
      }
    }
  }

  return (
    <>
      <PanelChat op={opNotify} />
      <div className="container-topnav wow animate__animated animate__fadeIn">
        <div className="label">
          <div className="user-label">
            {greetingsLabel} {userName ? userName : '--'}
          </div>
          <div className="icon-label">
            <i className={`pi ${classIcon}`} /> <h3>{componentLabel}</h3>
          </div>
        </div>
        <div className="container-user">
          <Avatar image={profileImage ? profileImage : defaultProfileImage} size="xlarge" shape="circle" />
          <div className="background-chat">
            <i
              className="pi pi-microchip-ai"
              onClick={(e) => {
                opNotify.current.toggle(e);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default injectIntl(TopNav);
