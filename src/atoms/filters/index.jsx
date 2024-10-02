import { atom } from 'recoil';
import { months } from '../../constants/enums';

export const keys = {
  YEAR: 'ATOM/FILTERS/YEAR',
  MONTH: 'ATOM/FILTERS/MONTH',
};

export const isCurrentYear = atom({
  key: keys.YEAR,
  default: new Date().getFullYear(),
});

export const isCurrentMonth = atom({
  key: keys.MONTH,
  default: months[new Date().getMonth()].value,
});
