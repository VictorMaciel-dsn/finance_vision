import React from 'react';
import { injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useRecoilValue } from 'recoil';
import { currentColor } from '../../atoms/theme/index';

function ModalAddInfos({ isOpen = false, setIsOpen = () => {}, intl }) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);

  return (
    <Modal
      data-theme={theme}
      centered={true}
      className="modal-add-infos"
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <ModalHeader>Header - Infos</ModalHeader>
      <ModalBody>Body - Infos</ModalBody>
      <ModalFooter>Footer - Infos</ModalFooter>
    </Modal>
  );
}

export default injectIntl(ModalAddInfos);
