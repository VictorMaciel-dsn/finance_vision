import { IonLoading } from '@ionic/react';

function LoadingComponent({ isLoading, text }) {
  return (
    <>
      <IonLoading isOpen={isLoading} message={text} />
    </>
  );
}

export default LoadingComponent;
