import { injectIntl } from 'react-intl';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentColor } from '../../atoms/theme';
import { useIonToast } from '@ionic/react';
import { get, getDatabase, ref, set } from 'firebase/database';
import { getCurrentUser } from '../../helpers/utils';
import { listUpdate, tokenUser } from '../../atoms/user';
import { parseJwt } from '../../helpers/format';
import LoadingComponent from '../loading';
import { useState } from 'react';

function ModalConfirmDeleteCard({
  isOpen = false,
  setIsOpen = () => {},
  intl = '',
  selectedCard = null,
  setSelectedCard = () => {},
}) {
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
          const db = getDatabase();
          const user = userToken || _userToken;
          const userId = parseJwt(user).user_id;
          const _ref = ref(db, `users/${userId}/cards`);

          if (_data[selectedCard?.id]) {
            delete _data[selectedCard?.id];
          }

          set(_ref, _data)
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
        console.error('Erro ao obter as informações:', error);
      });
  }

  async function getInfos() {
    const db = getDatabase();
    const user = userToken || _userToken;
    const userId = parseJwt(user).user_id;

    if (userId) {
      const dataRef = ref(db, `users/${userId}/cards`);
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
        toggle={() => {
          setSelectedCard(null);
          setIsOpen(!isOpen);
        }}
      >
        <ModalHeader>
          <i className="pi pi-exclamation-triangle" /> Atenção
        </ModalHeader>
        <ModalBody>
          <div className="title">{messages['message.confirmDelete']}</div>
          <div className="item-infos">
            <div>
              <b>Nome do cartão:</b> {selectedCard?.nameCard}
            </div>
            <div>
              <b>Dia de fechamento:</b> {selectedCard?.closingDay}
            </div>
            <div>
              <b>Dia de fechamento:</b> {selectedCard?.dueDate}
            </div>
            <div>
              <b>Limite:</b> {selectedCard?.limitCard}
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
          <Button
            className="btn-no"
            onClick={() => {
              setSelectedCard(null);
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

export default injectIntl(ModalConfirmDeleteCard);
