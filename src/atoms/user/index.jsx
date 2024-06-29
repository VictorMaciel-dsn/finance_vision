import { atom } from "recoil";

export const keys = {
  CHANGE_USER: "ATOM/USER/CHANGE_USER",
};

export const currentUser = atom({
  key: keys.CHANGE_USER,
  default: "",
});
