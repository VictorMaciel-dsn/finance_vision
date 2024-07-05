import { atom } from "recoil";

export const keys = {
  TOKEN_USER: 'ATOM/USER/TOKEN_USER',
};

export const tokenUser = atom({
  key: keys.TOKEN_USER,
  default: '',
});
