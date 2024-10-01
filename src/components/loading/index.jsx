import { IonLoading } from '@ionic/react';
import { injectIntl } from 'react-intl';

function LoadingComponent({ isLoading, intl }) {
  const { messages } = intl;

  return (
    <>
      <IonLoading isOpen={isLoading} message={messages['message.wait']} />
    </>
  );
}

export default injectIntl(LoadingComponent);
