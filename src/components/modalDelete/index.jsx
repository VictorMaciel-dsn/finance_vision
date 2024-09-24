import { injectIntl } from 'react-intl';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentColor } from '../../atoms/theme';
import { useIonToast } from '@ionic/react';
import { get, getDatabase, ref, update, set } from 'firebase/database';
import { getCurrentUser } from '../../helpers/utils';
import { listUpdate, tokenUser } from '../../atoms/user';
import { parseJwt } from '../../helpers/format';
import LoadingComponent from '../loading';
import { useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);
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
              message: 'Registro removido com sucesso!',
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
              message: 'Houve um erro ao remover o registro!',
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
            <b>Tipo:</b> {item?.label}
          </div>
          <div>
            <b>Valor:</b> {item?.value}
          </div>
          <div>
            <b>Data:</b> {item?.date}
          </div>
        </>
      );
    } else if (type === 'account') {
      return (
        <>
          <div>
            <b>Nome da conta:</b> {item?.name}
          </div>
          <div>
            <b>Saldo:</b> {item?.balance}
          </div>
        </>
      );
    } else if (type === 'card') {
      return (
        <>
          <div>
            <b>Nome do cartão:</b> {item?.nameCard}
          </div>
          <div>
            <b>Dia de fechamento:</b> {item?.closingDay}
          </div>
          <div>
            <b>Data de vencimento:</b> {item?.dueDate}
          </div>
          <div>
            <b>Limite:</b> {item?.limitCard}
          </div>
        </>
      );
    }
  };

  return (
    <>
      <LoadingComponent isLoading={isLoading} text={messages['message.wait']} />
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
          <i className="pi pi-exclamation-triangle" /> Atenção
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
            Sim
          </Button>
          <Button
            className="btn-no"
            onClick={() => {
              setSelectedItem(null);
              setIsOpen(!isOpen);
            }}
          >
            Não
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default injectIntl(ModalDelete);
