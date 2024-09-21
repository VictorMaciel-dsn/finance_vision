import { injectIntl } from 'react-intl';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentColor } from '../../atoms/theme';
import { useIonToast } from '@ionic/react';
import { get, getDatabase, ref, update } from 'firebase/database';
import { getCurrentUser } from '../../helpers/utils';
import { listUpdate, tokenUser } from '../../atoms/user';
import { parseJwt } from '../../helpers/format';
import LoadingComponent from '../loading';
import { useState } from 'react';

function ModalConfirmDelete({ isOpen = false, setIsOpen = () => {}, intl = '', item = null }) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);
  const [toast] = useIonToast();
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const [isLoading, setIsLoading] = useState(false);
  const setUpdateList = useSetRecoilState(listUpdate);

  function confirmDelete() {
    getInfos()
      .then((res) => {
        setIsLoading(true);

        if (res) {
          const _data = res;

          for (let category in _data) {
            if (_data[category][item?.id]) {
              delete _data[category][item?.id];
              break;
            }
          }

          const db = getDatabase();
          const user = userToken || _userToken;
          const userId = parseJwt(user).user_id;
          const userRef = ref(db, `users/${userId}`);

          update(userRef, _data)
            .then(() => {
              setIsLoading(false);
              toast({
                message: 'Registro removido com sucesso!',
                duration: 2000,
                position: 'bottom',
              });
              setUpdateList(true);
              setIsOpen(!isOpen);
            })
            .catch((error) => {
              setIsLoading(false);
              toast({
                message: 'Houve um erro ao remover o registro!',
                duration: 2000,
                position: 'bottom',
              });
              console.error('Erro ao atualizar a lista no Firebase:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Erro ao obter as informações da lista:', error);
      });
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
      <LoadingComponent isLoading={isLoading} text={messages['message.wait']} />
      <Modal
        data-theme={theme}
        centered={true}
        className="modal-confirm"
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
      >
        <ModalHeader>
          <i className="pi pi-exclamation-triangle" /> Atenção
        </ModalHeader>
        <ModalBody>
          <div className="title">{messages['message.confirmDelete']}</div>
          <div className="item-infos">
            <div>
              <b>Tipo:</b> {item?.label}
            </div>
            <div>
              <b>Valor:</b> {item?.value}
            </div>
            <div>
              <b>Data:</b> {item?.date}
            </div>
          </div>
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
          <Button className="btn-no" onClick={() => setIsOpen(!isOpen)}>
            Não
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default injectIntl(ModalConfirmDelete);
