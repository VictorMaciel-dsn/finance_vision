import React from 'react';
import { injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useRecoilValue } from 'recoil';
import { currentColor } from '../../atoms/theme/index';

function ModalAddCard({ isOpen = false, setIsOpen = () => {}, intl = '' }) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);

  return (
    <Modal
      data-theme={theme}
      centered={true}
      className="modal-add-card"
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <ModalHeader>Header</ModalHeader>
      <ModalBody>Body</ModalBody>
      <ModalFooter>Footer</ModalFooter>
    </Modal>
  );
}

export default injectIntl(ModalAddCard);
