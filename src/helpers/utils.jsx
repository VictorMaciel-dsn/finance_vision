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

export const selectedBankTemplate = (option, props) => {
  if (option) {
    return (
      <div className="d-flex align-items-center">
        <img
          alt={option.name}
          src={option.img}
          className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          style={{ width: '25px' }}
        />
        <div>{option.name}</div>
      </div>
    );
  }

  return <span>{props.placeholder}</span>;
};

export const bankOptionTemplate = (option) => {
  return (
    <div className="d-flex align-items-center">
      <img
        alt={option.name}
        src={option.img}
        className={`mr-2 flag flag-${option.code.toLowerCase()}`}
        style={{ width: '25px' }}
      />
      <div>{option.name}</div>
    </div>
  );
};

export const createDaysOptions = () => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push({ value: i, label: i.toString() });
  }
  return days;
};
