import { injectIntl } from 'react-intl';
import { OverlayPanel } from 'primereact/overlaypanel';

function PanelTotalBalance({ intl, op }) {
  const { messages } = intl;

  return (
    <>
      <OverlayPanel className="panel-total-balance" ref={op} appendTo={document.getElementsByClassName('main')[0]}>
        <div>O "Saldo total" é composto pelos seguintes valores:</div>
        <ul>
          <li>Entradas</li>
          <li>Investidos</li>
          <li>Saldo em contas</li>
        </ul>
      </OverlayPanel>
    </>
  );
}

export default injectIntl(PanelTotalBalance);
