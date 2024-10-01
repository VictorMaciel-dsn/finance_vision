import { injectIntl } from 'react-intl';
import Footer from '../../footer';
import TopNav from '../../topnav';
import { months } from '../../../../constants/enums';
import { getTranslatedMonths, parseJwt } from '../../../../helpers/format';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useRef, useState } from 'react';
import { ChevronUpIcon } from 'primereact/icons/chevronup';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { InputText } from 'primereact/inputtext';
import { get, getDatabase, ref } from 'firebase/database';
import { getCurrentUser } from '../../../../helpers/utils';
import { useRecoilValue } from 'recoil';
import { tokenUser } from '../../../../atoms/user';
import LoadingComponent from '../../../../components/loading';
import Chart from 'chart.js/auto';
import { currentColor } from '../../../../atoms/theme';

function GraphicsPage({ intl }) {
  const { messages } = intl;
  const currentMonth = new Date().getMonth();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth].value);
  const translatedMonths = getTranslatedMonths(intl);
  const _userToken = getCurrentUser();
  const userToken = useRecoilValue(tokenUser);
  const [isLoading, setIsLoading] = useState(false);
  const isFirst = useRef(true);
  const chartPolarRef = useRef(null);
  const chartBarRef = useRef(null);
  const theme = useRecoilValue(currentColor);

  useEffect(() => {
    if (isFirst.current) {
      setIsLoading(true);

      getInfos()
        .then((res) => {
          setIsLoading(false);
          if (res) {
            delete res.image;
            const _data = res;
            console.log(_data);
            renderPolarChart(_data);
            renderBarChart(_data);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Erro ao obter as informações:', error);
        });

      isFirst.current = false;
    }
  }, []);

  async function getInfos() {
    const db = getDatabase();
    const user = userToken || _userToken;
    const userId = parseJwt(user).user_id;

    if (userId) {
      const dataRef = ref(db, `users/${userId}`);
      try {
        const res = await get(dataRef);
        return res.val();
      } catch {
        return null;
      }
    }
  }

  // Função para renderizar o gráfico de Área Polar
  function renderPolarChart(data) {
    const entriesSum = Object.values(data.entries).reduce((acc, item) => acc + parseFloat(item.value), 0);
    const investedSum = Object.values(data.invested).reduce((acc, item) => acc + parseFloat(item.value), 0);
    const payableSum = Object.values(data.payable).reduce((acc, item) => acc + parseFloat(item.value), 0);
    const paymentsSum = Object.values(data.payments).reduce((acc, item) => acc + parseFloat(item.value), 0);

    const ctx = chartPolarRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: ['Entradas', 'Investimentos', 'Pagamentos', 'A pagar'],
        datasets: [
          {
            label: 'Distribuição Financeira',
            data: [entriesSum, investedSum, paymentsSum, payableSum],
            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: theme === 'dark' ? '#acacac' : '#333333',
            },
          },
        },
        scales: {
          r: {
            ticks: {
              color: theme === 'dark' ? '#acacac' : '#333333',
            },
          },
        },
      },
    });
  }

  // Função para renderizar o gráfico de Barras
  function renderBarChart(data) {
    const entriesSum = Object.values(data.entries).reduce((acc, item) => acc + parseFloat(item.value), 0);
    const investedSum = Object.values(data.invested).reduce((acc, item) => acc + parseFloat(item.value), 0);
    const payableSum = Object.values(data.payable).reduce((acc, item) => acc + parseFloat(item.value), 0);
    const paymentsSum = Object.values(data.payments).reduce((acc, item) => acc + parseFloat(item.value), 0);

    const ctx = chartBarRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Entradas', 'Investimentos', 'Pagamentos', 'A pagar'],
        datasets: [
          {
            label: 'Distribuição Financeira',
            data: [entriesSum, investedSum, paymentsSum, payableSum],
            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: theme === 'dark' ? '#acacac' : '#333333',
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: theme === 'dark' ? '#acacac' : '#333333',
            },
          },
          y: {
            ticks: {
              color: theme === 'dark' ? '#acacac' : '#333333',
            },
          },
        },
      },
    });
  }

  return (
    <>
      <LoadingComponent isLoading={isLoading} text={messages['message.wait']} />
      <div className="graphics-page">
        <TopNav />
        <div className="wow animate__animated animate__fadeIn">
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
          <div className="container-graphics">
            {/* Gráfico de Área Polar */}
            <canvas ref={chartPolarRef} />
            {/* Gráfico de Barras */}
            <canvas ref={chartBarRef} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default injectIntl(GraphicsPage);
