import React from 'react';
import { injectIntl } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useRecoilValue } from 'recoil';
import { currentColor } from '../../atoms/theme/index';

function ModalAddAccounts({ isOpen = false, setIsOpen = () => {}, intl = '' }) {
  const { messages } = intl;
  const theme = useRecoilValue(currentColor);

  return (
    <Modal
      data-theme={theme}
      centered={true}
      className="modal-add-accounts"
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <ModalHeader>Header - Accounts</ModalHeader>
      <ModalBody>Body - Accounts</ModalBody>
      <ModalFooter>Footer - Accounts</ModalFooter>
    </Modal>
  );
}

export default injectIntl(ModalAddAccounts);
