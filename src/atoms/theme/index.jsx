import { atom } from 'recoil';

export const keys = {
  CHANGE_COLOR: 'ATOM/THEME/CHANGE_COLOR',
};

export const currentColor = atom({
  key: keys.CHANGE_COLOR,
  default: 'dark',
});
