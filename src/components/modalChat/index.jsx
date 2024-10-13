import { injectIntl } from 'react-intl';
import { Standard } from '@typebot.io/react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { currentColor } from '../../atoms/theme';
import { useRecoilValue } from 'recoil';

function ModalChatBot({ intl = '', isOpen = false, setIsOpen = () => {} }) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);

  return (
    <>
      <Modal
        data-theme={theme}
        centered={true}
        className="modal-chat-bot"
        isOpen={isOpen}
        toggle={() => {
          setIsOpen(!isOpen);
        }}
      >
        <ModalBody>
          <Standard typebot="financial-advisor-grtf00i" />
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-closed"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {messages['message.close']}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default injectIntl(ModalChatBot);
