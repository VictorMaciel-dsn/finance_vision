import { injectIntl } from 'react-intl';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentColor } from '../../atoms/theme';
import { useIonToast } from '@ionic/react';
import { get, getDatabase, ref, update, set } from 'firebase/database';
import { getCurrentUser } from '../../helpers/utils';
import { listUpdate, tokenUser } from '../../atoms/user';
import { parseJwt } from '../../helpers/format';
import { currentIsLoad } from '../../atoms/loading';

function ModalDelete({
  isOpen = false,
  setIsOpen = () => {},
  intl = '',
  item = null,
  type = 'item',
  setSelectedItem = () => {},
}) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);
  const [toast] = useIonToast();
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const setIsLoading = useSetRecoilState(currentIsLoad);
  const setUpdateList = useSetRecoilState(listUpdate);

  function confirmDelete() {
    setIsLoading(true);

    getInfos()
      .then((data) => {
        if (!data) return;

        const db = getDatabase();
        const user = userToken || _userToken;
        const userId = parseJwt(user)?.user_id;

        const refPath = {
          item: `users/${userId}`,
          account: `users/${userId}/accounts`,
          card: `users/${userId}/cards`,
        }[type];

        if (!refPath) return;

        const dataRef = ref(db, refPath);

        if (type === 'item') {
          Object.keys(data).forEach((category) => {
            if (data[category][item?.id]) {
              delete data[category][item?.id];
            }
          });
        } else if (data[item?.id]) {
          delete data[item?.id];
        }

        const saveMethod = type === 'item' ? update : set;

        saveMethod(dataRef, data)
          .then(() => {
            toast({
              message: messages['message.registerDeleteSuccess'],
              duration: 2000,
              position: 'bottom',
            });
            setUpdateList(true);
            setIsOpen(!isOpen);
            setSelectedItem(null);
          })
          .catch((error) => {
            console.error('Erro ao atualizar a lista no Firebase:', error);
            toast({
              message: messages['message.registerDeleteError'],
              duration: 2000,
              position: 'bottom',
            });
          })
          .finally(() => setIsLoading(false));
      })
      .catch((error) => {
        console.error('Erro ao obter as informações:', error);
        setIsLoading(false);
      });
  }

  async function getInfos() {
    const db = getDatabase();
    const user = userToken || _userToken;
    const userId = parseJwt(user).user_id;

    let refPath;
    if (type === 'item') {
      refPath = `users/${userId}`;
    } else if (type === 'account') {
      refPath = `users/${userId}/accounts`;
    } else if (type === 'card') {
      refPath = `users/${userId}/cards`;
    }

    if (userId) {
      const dataRef = ref(db, refPath);
      try {
        const res = await get(dataRef);
        return res.val();
      } catch {
        return null;
      }
    }
  }

  const renderInfo = () => {
    if (type === 'item') {
      return (
        <>
          <div>
            <b>{messages['message.type']}:</b> {item?.label}
          </div>
          <div>
            <b>{messages['message.value']}:</b> {item?.value}
          </div>
          <div>
            <b>{messages['message.date']}:</b> {item?.date}
          </div>
        </>
      );
    } else if (type === 'account') {
      return (
        <>
          <div>
            <b>{messages['message.accountName']}</b> {item?.name}
          </div>
          <div>
            <b>{messages['message.accountBalance']}</b> {item?.balance}
          </div>
        </>
      );
    } else if (type === 'card') {
      return (
        <>
          <div>
            <b>{messages['message.cardName']}:</b> {item?.nameCard}
          </div>
          <div>
            <b>{messages['message.closingDay']}:</b> {item?.closingDay}
          </div>
          <div>
            <b>{messages['message.dueDateHome']}:</b> {item?.dueDate}
          </div>
          <div>
            <b>{messages['message.limitCard']}:</b> {item?.limitCard}
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Modal
        data-theme={theme}
        centered={true}
        className="modal-delete"
        isOpen={isOpen}
        toggle={() => {
          setSelectedItem(null);
          setIsOpen(!isOpen);
        }}
      >
        <ModalHeader>
          <i className="pi pi-exclamation-triangle" /> {messages['message.attention']}
        </ModalHeader>
        <ModalBody>
          <div className="title">{messages['message.confirmDelete']}</div>
          <div className="item-infos">{renderInfo()}</div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-yes"
            onClick={() => {
              confirmDelete();
            }}
          >
            {messages['message.yes']}
          </Button>
          <Button
            className="btn-no"
            onClick={() => {
              setSelectedItem(null);
              setIsOpen(!isOpen);
            }}
          >
            {messages['message.no']}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default injectIntl(ModalDelete);
