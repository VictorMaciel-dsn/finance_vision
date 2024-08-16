import { injectIntl } from 'react-intl';
import Footer from '../../footer';
import TopNav from '../../topnav';
import { months } from '../../../../constants/enums';
import { getTranslatedMonths } from '../../../../helpers/format';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { InputText } from 'primereact/inputtext';

function WalletPage({ intl }) {
  const { messages } = intl;
  const currentMonth = new Date().getMonth();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth].value);
  const translatedMonths = getTranslatedMonths(intl);

  return (
    <>
      <div className="reports-page">
        <TopNav />
        <div className="container-reports wow animate__animated animate__fadeIn">
          <div className="container-filter mb-2">
            <InputText
              className="input-form"
              placeholder="Ano"
              type="number"
              value={currentYear}
              onChange={(e) => {
                const _val = e.target.value;
                if (_val.length <= 4) {
                  setCurrentYear(_val);
                }
              }}
            />
            <Dropdown
              emptyMessage={messages['message.notData']}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.value)}
              options={translatedMonths}
              optionLabel="label"
              optionValue="value"
              placeholder={messages['message.selectMonth']}
              appendTo={document.getElementsByClassName('main')[0]}
              dropdownIcon={(opts) => {
                return opts.iconProps['data-pr-overlay-visible'] ? (
                  <ChevronUpIcon {...opts.iconProps} />
                ) : (
                  <ChevronDownIcon {...opts.iconProps} />
                );
              }}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default injectIntl(WalletPage);
