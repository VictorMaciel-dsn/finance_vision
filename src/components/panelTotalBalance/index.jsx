import { injectIntl } from 'react-intl';
import { OverlayPanel } from 'primereact/overlaypanel';

function PanelTotalBalance({ intl, op }) {
  const { messages } = intl;

  return (
    <>
      <OverlayPanel className="panel-total-balance" ref={op} appendTo={document.getElementsByClassName('main')[0]}>
        <div>{messages['message.titlePanel']}</div>
        <ul>
          <li>{messages['message.entries']}</li>
          <li>{messages['message.investes']}</li>
          <li>{messages['messages.accountBalance']}</li>
        </ul>
      </OverlayPanel>
    </>
  );
}

export default injectIntl(PanelTotalBalance);
