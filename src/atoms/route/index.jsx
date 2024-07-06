import { atom } from "recoil";

export const keys = {
  CURRENT_ROUTE: 'ATOM/USER/CURRENT_ROUTE',
};

export const route = atom({
  key: keys.CURRENT_ROUTE,
  default: '',
});
