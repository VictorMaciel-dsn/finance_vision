import { defaultLocale, userStorageKey } from '../constants/defaultValues';

export const getCurrentUser = () => {
  let user = null;
  try {
    user = localStorage.getItem(userStorageKey);
    if (user) {
      user = JSON.parse(user);
    }
  } catch (error) {
    console.log('>>>>: src/helpers/utils.js  : getCurrentUser > error', error);
    user = null;
  }
  return user;
};

export const setCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(userStorageKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(userStorageKey);
    }
  } catch (error) {
    console.log('>>>>: src/helpers/utils.js : setCurrentUser > error', error);
  }
};

export const getCurrentLanguage = () => {
  let language = defaultLocale;
  try {
    language =
      localStorage.getItem('currentLanguage') &&
      localeOptions.filter((x) => x.id === localStorage.getItem('currentLanguage')).length > 0
        ? localStorage.getItem('currentLanguage')
        : defaultLocale;
  } catch (error) {
    console.log('>>>>: src/helpers/Utils.js : getCurrentLanguage -> error', error);
    language = defaultLocale;
  }
  return language;
};
