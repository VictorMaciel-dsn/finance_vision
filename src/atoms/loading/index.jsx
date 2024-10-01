import { atom } from 'recoil';

export const keys = {
  LOAD: 'ATOM/LOAD/LOAD',
};

export const currentIsLoad = atom({
  key: keys.LOAD,
  default: false,
});
