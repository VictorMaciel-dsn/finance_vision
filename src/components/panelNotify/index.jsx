import { injectIntl } from 'react-intl';
import { OverlayPanel } from 'primereact/overlaypanel';

function PanelNotify({ intl, op }) {
  const { messages } = intl;

  return (
    <>
      <OverlayPanel ref={op} appendTo={document.getElementsByClassName('main')[0]}>
        Notificações - TESTE - 123
      </OverlayPanel>
    </>
  );
}

export default injectIntl(PanelNotify);
