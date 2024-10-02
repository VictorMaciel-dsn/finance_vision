import { injectIntl } from 'react-intl';
import { OverlayPanel } from 'primereact/overlaypanel';

function PanelChat({ intl, op }) {
  const { messages } = intl;

  return (
    <>
      <OverlayPanel ref={op} appendTo={document.getElementsByClassName('main')[0]}>
        ChatBOT - 123
      </OverlayPanel>
    </>
  );
}

export default injectIntl(PanelChat);
