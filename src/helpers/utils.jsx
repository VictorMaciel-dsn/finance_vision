import { userStorageKey } from '../constants/defaultValues';

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
