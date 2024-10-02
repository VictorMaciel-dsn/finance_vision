import { injectIntl } from 'react-intl';
import Footer from '../../footer';
import TopNav from '../../topnav';
import { months } from '../../../../constants/enums';
import { getTranslatedMonths, parseJwt } from '../../../../helpers/format';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { get, getDatabase, ref } from 'firebase/database';
import { getCurrentUser } from '../../../../helpers/utils';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { tokenUser } from '../../../../atoms/user';
import { currentColor } from '../../../../atoms/theme';
import { currentIsLoad } from '../../../../atoms/loading';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';

function GraphicsPage({ intl }) {
  const { messages } = intl;
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()].value);
  const translatedMonths = getTranslatedMonths(intl);
  const userToken = useRecoilValue(tokenUser) || getCurrentUser();
  const theme = useRecoilValue(currentColor);
  const setIsLoading = useSetRecoilState(currentIsLoad);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetchUserData()
      .then((res) => {
        setIsLoading(false);
        res && setChartData(processChartData(res));
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Erro ao obter as informações:', error);
      });
  }, []);

  async function fetchUserData() {
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
      { id: 'Entradas', value: sumValues(data.entries) },
      { id: 'Investimentos', value: sumValues(data.invested) },
      { id: 'Pagamentos', value: sumValues(data.payments) },
      { id: 'A pagar', value: sumValues(data.payable) },
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
        <div className="container-filter mb-2">
          <InputText
            className="input-form"
            placeholder="Ano"
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
              {/* Gráfico em Donut */}
              <div className="donut-chart-container">
                <ResponsivePie
                  data={chartData}
                  margin={{ top: 0, right: 110, bottom: 0, left: 115 }} // Ajustando margens
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={({ id }) => {
                    switch (id) {
                      case 'Entradas':
                        return 'var(--theme-color-3)';
                      case 'A pagar':
                        return 'var(--color-red)';
                      case 'Investimentos':
                        return 'var(--theme-color-2)';
                      case 'Pagamentos':
                        return 'var(--color-red)';
                      default:
                        return '#ccc'; // Cor de fallback
                    }
                  }}
                  borderWidth={1}
                  borderColor="#cccccc4d"
                  arcLinkLabelsTextColor={theme === 'dark' ? '#acacac' : '#333333'}
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsRadiusOffset={0.5}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  theme={{
                    textColor: theme === 'dark' ? '#acacac' : '#333333',
                    tooltip: { container: { background: theme === 'dark' ? '#333' : '#fff' } },
                  }}
                />
              </div>

              {/* Gráfico de Barras */}
              <div className="bar-chart-container">
                <ResponsiveBar
                  data={chartData}
                  keys={['value']}
                  indexBy="id"
                  margin={{ top: 0, right: 10, bottom: 100, left: 50 }} // Ajuste nas margens
                  padding={0.4}
                  colors={({ data }) => {
                    switch (data.id) {
                      case 'Entradas':
                        return 'var(--theme-color-3)';
                      case 'A pagar':
                        return 'var(--color-red)';
                      case 'Investimentos':
                        return 'var(--theme-color-2)';
                      case 'Pagamentos':
                        return 'var(--color-red)';
                      default:
                        return '#ccc'; // Cor de fallback
                    }
                  }}
                  borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Categoria',
                    legendPosition: 'middle',
                    legendOffset: 50,
                    tickTextColor: theme === 'dark' ? '#acacac' : '#333333', // Cor dos ticks conforme o tema
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    legend: 'Valor',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    tickValues: 'auto',
                    tickTextColor: theme === 'dark' ? '#acacac' : '#333333', // Cor dos ticks conforme o tema
                  }}
                  theme={{
                    textColor: theme === 'dark' ? '#acacac' : '#333333', // Cor do texto geral conforme o tema
                    tooltip: { container: { background: theme === 'dark' ? '#333' : '#fff' } },
                  }}
                  // Adicionando a propriedade para mudar a cor dos labels das barras
                  labelTextColor={theme === 'dark' ? '#acacac' : '#333333'} // Cor do texto dos labels das colunas
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
