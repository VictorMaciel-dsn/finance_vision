import { injectIntl } from 'react-intl';
import Footer from '../../footer';
import TopNav from '../../topnav';
import { getTranslatedMonths, parseJwt } from '../../../../helpers/format';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { get, getDatabase, ref } from 'firebase/database';
import { getCurrentLanguage, getCurrentUser } from '../../../../helpers/utils';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { tokenUser } from '../../../../atoms/user';
import { currentColor } from '../../../../atoms/theme';
import { currentIsLoad } from '../../../../atoms/loading';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { isCurrentMonth, isCurrentYear } from '../../../../atoms/filters';

function GraphicsPage({ intl }) {
  const { messages } = intl;
  const translatedMonths = getTranslatedMonths(intl);
  const [selectedMonth, setSelectedMonth] = useRecoilState(isCurrentMonth);
  const [currentYear, setCurrentYear] = useRecoilState(isCurrentYear);
  const userToken = useRecoilValue(tokenUser) || getCurrentUser();
  const theme = useRecoilValue(currentColor);
  const setIsLoading = useSetRecoilState(currentIsLoad);
  const [chartData, setChartData] = useState(null);
  const isFirst = useRef(true);
  const currentLang = getCurrentLanguage();

  useEffect(() => {
    const fetchAndProcessData = async () => {
      if (!isFirst.current && !(selectedMonth && currentYear.toString().length === 4)) return;

      setIsLoading(true);

      try {
        const res = await getInfos();
        if (res) {
          const { image, ..._data } = res;

          const filterValues = (items) =>
            Object.values(items || []).filter(({ date }) => {
              const [, month, year] = date.split(',')[0].trim().split('/');
              return parseInt(month, 10) === selectedMonth && parseInt(year, 10) === currentYear;
            });

          const filteredData = ['entries', 'invested', 'payable', 'payments'].reduce((acc, key) => {
            acc[key] = filterValues(_data[key]);
            return acc;
          }, {});

          setChartData(processChartData(filteredData));
        }
      } catch (error) {
        console.error('Erro ao obter as informações:', error);
      } finally {
        setIsLoading(false);
        isFirst.current = false;
      }
    };

    fetchAndProcessData();
  }, [selectedMonth, currentYear]);

  async function getInfos() {
    const userId = parseJwt(userToken).user_id;
    if (!userId) return null;

    try {
      const res = await get(ref(getDatabase(), `users/${userId}`));
      return res.val();
    } catch {
      return null;
    }
  }

  function processChartData(data) {
    const sumValues = (items) => Object.values(items || {}).reduce((acc, item) => acc + parseFloat(item.value), 0);
    return [
      { id: messages['message.entries'], value: sumValues(data.entries) },
      { id: messages['message.investments'], value: sumValues(data.invested) },
      { id: messages['message.payments'], value: sumValues(data.payments) },
      { id: messages['message.payable'], value: sumValues(data.payable) },
    ];
  }

  const renderDropdownIcon = (opts) =>
    opts.iconProps['data-pr-overlay-visible'] ? (
      <ChevronUpIcon {...opts.iconProps} />
    ) : (
      <ChevronDownIcon {...opts.iconProps} />
    );

  return (
    <div className="graphics-page">
      <TopNav />
      <div className="wow animate__animated animate__fadeIn">
        <div className="container-filter">
          <InputText
            className="input-form"
            placeholder={messages['message.year']}
            type="number"
            value={currentYear}
            onChange={(e) => e.target.value.length <= 4 && setCurrentYear(e.target.value)}
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
            dropdownIcon={renderDropdownIcon}
          />
        </div>
        <div className="container-graphics">
          {chartData && (
            <>
              <div className="donut-chart-container">
                <ResponsivePie
                  data={chartData}
                  margin={{ top: 0, right: 110, bottom: 0, left: 115 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={({ id }) => {
                    if (currentLang === 'pt-br' && id) {
                      return (
                        {
                          Entradas: 'var(--theme-color-3)',
                          'A pagar': 'var(--color-red)',
                          Investimentos: 'var(--theme-color-2)',
                          Pagamentos: 'var(--color-red)',
                        }[id] || '#ccc'
                      );
                    } else if (currentLang === 'en' && id) {
                      return (
                        {
                          Entries: 'var(--theme-color-3)',
                          Payable: 'var(--color-red)',
                          Investments: 'var(--theme-color-2)',
                          Payments: 'var(--color-red)',
                        }[id] || '#ccc'
                      );
                    }
                    return '#ccc';
                  }}
                  borderWidth={1}
                  borderColor="#cccccc4d"
                  arcLinkLabelsTextColor={theme === 'dark' ? '#acacac' : '#333333'}
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsRadiusOffset={0.5}
                  arcLabelsTextColor="#fff"
                  theme={{
                    textColor: theme === 'dark' ? '#acacac' : '#333333',
                    tooltip: { container: { background: theme === 'dark' ? '#333' : '#fff' } },
                  }}
                />
              </div>
              <div className="bar-chart-container">
                <ResponsiveBar
                  data={chartData}
                  keys={['value']}
                  indexBy="id"
                  margin={{ top: 5, right: 10, bottom: 110, left: 50 }}
                  padding={0.4}
                  colors={({ data }) => {
                    if (currentLang === 'pt-br' && data.id) {
                      return (
                        {
                          Entradas: 'var(--theme-color-3)',
                          'A pagar': 'var(--color-red)',
                          Investimentos: 'var(--theme-color-2)',
                          Pagamentos: 'var(--color-red)',
                        }[data.id] || '#ccc'
                      );
                    } else if (currentLang === 'en' && data.id) {
                      return (
                        {
                          Entries: 'var(--theme-color-3)',
                          Payable: 'var(--color-red)',
                          Investments: 'var(--theme-color-2)',
                          Payments: 'var(--color-red)',
                        }[data.id] || '#ccc'
                      );
                    }
                    return '#ccc';
                  }}
                  borderColor="#cccccc4d"
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Categoria',
                    legendPosition: 'middle',
                    legendOffset: 50,
                    tickTextColor: theme === 'dark' ? '#acacac' : '#333333',
                    legendTextColor: theme === 'dark' ? '#acacac' : '#333333',
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    legend: 'Valor',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    tickValues: 'auto',
                    tickTextColor: theme === 'dark' ? '#acacac' : '#333333',
                    legendTextColor: theme === 'dark' ? '#acacac' : '#333333',
                  }}
                  theme={{
                    axis: {
                      ticks: { text: { fill: theme === 'dark' ? '#acacac' : '#333333' } },
                      legend: { text: { fill: theme === 'dark' ? '#acacac' : '#333333' } },
                    },
                    textColor: theme === 'dark' ? '#acacac' : '#333333',
                    tooltip: { container: { background: theme === 'dark' ? '#333' : '#fff' } },
                  }}
                  labelTextColor="#ffff"
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default injectIntl(GraphicsPage);
