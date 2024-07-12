import {
  defaultLocale,
  defaultTheme,
  langStorageKey,
  themeStorageKey,
  userStorageKey,
} from '../constants/defaultValues';

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
    const storedLanguage = localStorage.getItem(langStorageKey);
    if (storedLanguage) {
      language = storedLanguage;
    }
  } catch (error) {
    console.log('>>>>: src/helpers/Utils.js : getCurrentLanguage -> error', error);
  }
  return language;
};

export const setCurrentLanguage = (locale) => {
  try {
    localStorage.setItem(langStorageKey, locale);
  } catch (error) {
    console.log('>>>>: src/helpers/Utils.js : setCurrentLanguage -> error', error);
  }
};

export const getCurrentTheme = () => {
  let theme = defaultTheme;
  try {
    const storedTheme = localStorage.getItem(themeStorageKey);
    if (storedTheme) {
      theme = storedTheme;
    }
  } catch (error) {
    console.log('>>>>: src/helpers/Utils.js : getCurrentTheme -> error', error);
  }
  return theme;
};

export const setCurrentTheme = (locale) => {
  try {
    localStorage.setItem(themeStorageKey, locale);
  } catch (error) {
    console.log('>>>>: src/helpers/Utils.js : setCurrentTheme -> error', error);
  }
};
