import { atom } from 'recoil';
import { getCurrentLanguage } from '../../helpers/utils';

export const keys = {
  CHANGE_LANG: 'ATOM/LANG/CHANGE_LANG',
};

export const currentLanguage = atom({
  key: keys.CHANGE_LANG,
  default: getCurrentLanguage(),
});
