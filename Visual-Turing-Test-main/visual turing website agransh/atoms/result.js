import { atom } from "recoil";

export const resultState = atom({
  key: "resultState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});